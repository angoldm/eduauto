import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Timerecord, TimetableService } from './timetable.service';
import { FullCalendarComponent, CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/angular'; // useful for typechecking
import { INITIAL_EVENTS, createEventId } from '../event-utils';
import ruLocale from '@fullcalendar/core/locales/ru';
import { MessageService } from '../message.service';

interface DateInfo {
  start: Date,
  end: Date,
  startStr: string,
  endStr: string,
  timeZone: string,
  view: string
}

@Component({
  selector: 'timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit, AfterViewInit {

  timetable: Timerecord[]

  calendarVisible = true;

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'timeGridWeek',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    locale: ruLocale,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    datesSet: this.handleDates.bind(this),
    buttonText: {
      today: 'сегодня',
      month: 'месяц',
      week: 'неделя',
      day: 'день',
      list: 'записи'
    }
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };

  currentEvents: EventApi[] = [];
  calendarDate: Date;
  calendarApi: any;

  constructor(private timetableService: TimetableService, private messageService: MessageService) { }

  ngOnInit(): void {
    //this.getTimetable()
  }

  ngAfterViewInit(){
    this.calendarApi = this.calendarComponent.getApi();
    //this.calendarDate = this.calendarApi.view.currentStart;
  }
  getTimetable(satartDate: Date): void {
    this.timetable = []
    this.timetableService.getTimetableRange(satartDate)
      .subscribe(timetable => {
        //this.messageService.add(`Загружена ${timetable[0].name}`)
        this.timetable = this.timetable.concat(timetable)
      })
  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Введите описание новой поездки');
    const calendarApi = selectInfo.view.calendar;
    this.calendarDate = calendarApi.getDate();

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Вы хотите удалить выбранную поездку из графика '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    //let calendarApi = this.calendarComponent.getApi();
    //this.calendarDate = calendarApi.getDate()
  }
  /**
   * @param start  A Date for the beginning of the range the calendar needs events for.
   * @param end       A Date for the end of the range the calendar needs events for. Note: This value is exclusive.
   * @param startStr  An ISO8601 string representation of the start date. Will have a time zone offset according to the calendar’s timeZone like 2018-09-01T12:30:00-05:00.
   * @param endStr    Just like startStr, but for the end date.
   * @param timeZone  The exact value of the calendar’s timeZone setting.
   * @param view      The current View Object. 
   */
  handleDates(dateInfo: DateInfo) {
    this.calendarDate = dateInfo.start
    this.getTimetable(dateInfo.start)
  }

}
