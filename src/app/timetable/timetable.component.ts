import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Timerecord, TimetableService } from './timetable.service';
import { FullCalendarComponent, CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/angular'; // useful for typechecking
import { INITIAL_EVENTS, createEventId, DateInfo } from '../utils/event-utils';
import ruLocale from '@fullcalendar/core/locales/ru';
import { MessageService } from '../message.service';
import { formatDate } from '@angular/common';
import { AuthenticationService } from '../auth/authentication.service';
import { ReqStatus, ReqStatusService } from '../req-status/req-status.service';

@Component({
  selector: 'timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit, AfterViewInit, OnDestroy  {

  timetable: Timerecord[]
  reqstatus: ReqStatus[]

  calendarVisible = true;

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  currentEvents: EventApi[] = [];
  initialDate: Date = new Date(localStorage.getItem('timetabeStart') ? localStorage.getItem('timetabeStart') : Date());

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
    slotMinTime: "07:00:00",
    slotMaxTime: "23:00:00",
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
    },
    events: this.currentEvents,
    initialDate: this.initialDate
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };

  calendarDate: Date;
  calendarApi: any;

  constructor(private timetableService: TimetableService,
    private reqStatusService: ReqStatusService,
    private authenticationService: AuthenticationService, 
    private messageService: MessageService) { }

  ngOnInit(): void {
    //this.getTimetable()
    //localStorage.setItem('isInit', '1')
    /*const timetabeStart = localStorage.getItem('timetabeStart')
    if (timetabeStart)
      this.initialDate = new Date(timetabeStart)
    else
      this.initialDate = new Date()*/
  }

  ngAfterViewInit(){
    this.calendarApi = this.calendarComponent.getApi();
    /*const timetabeStart = localStorage.getItem('timetabeStart')
    if (timetabeStart)
      this.calendarApi.gotoDate(timetabeStart)*/
    //let calDate = this.calendarApi.getDate()
    //this.calendarDate = this.calendarApi.view.currentStart;
  }

  /** Вызывается при смене видимого диапазона дат (напр., в режиме неделя - смена надели) и при обновлении страницы!
   * @param dateInfo: DateInfo - members:
   * @param start  A Date for the beginning of the range the calendar needs events for.
   * @param end       A Date for the end of the range the calendar needs events for. Note: This value is exclusive.
   * @param startStr  An ISO8601 string representation of the start date. Will have a time zone offset according to the calendar’s timeZone like 2018-09-01T12:30:00-05:00.
   * @param endStr    Just like startStr, but for the end date.
   * @param timeZone  The exact value of the calendar’s timeZone setting.
   * @param view      The current View Object. 
   */
   handleDates(dateInfo: DateInfo) {
    //if (localStorage.getItem('isInit') == null) {
      this.calendarDate = dateInfo.start
      //this.getTimetable(dateInfo.start)
      this.updateReqStatus()
      localStorage.setItem('timetabeStart', formatDate(dateInfo.start, 'YYYY-MM-dd', 'en-US'))
    //} else localStorage.removeItem('isInit')
    //localStorage.setItem('timetabeStart', formatDate(this.calendarApi.getDate(), 'YYYY-MM-dd', 'en-US'))
  }

  updateReqStatus(): void {
    //this.reqstatus = []
    this.reqStatusService.getReqStatus()
      .subscribe(reqstatus => {
        //this.messageService.add(`Загружена ${timetable[0].name}`)
        this.reqstatus = reqstatus;
        this.calendarOptions.events = reqstatus.map(reqstatus => {
          return {
            id: createEventId(),
            title: reqstatus.vid,
            start: reqstatus.begin,
            end: new Date(reqstatus.begin.setHours(reqstatus.begin.getHours()+2)), //найти конец занятия
            allDay: false
          }
        })
      })
  }

  getTimetable(satartDate: Date): void {
    this.timetable = []
    this.timetableService.getTimetableRange(satartDate, 'aa2b4b99-f3c6-11e9-b7f1-d6d62339e3ad'
    )
      .subscribe(timetable => {
        //this.messageService.add(`Загружена ${timetable[0].name}`)
        this.timetable = this.timetable.concat(timetable[0])
        timetable.forEach(t => {
          this.timetable = this.timetable.concat(t)
        });
        this.calendarOptions.events = this.timetable.map(timetable => {
          return {
            id: createEventId(),
            title: `${timetable.name} ${timetable.vid}`,
            start: timetable.begin,
            end: timetable.end,
            allDay: false
          }
        })
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
  }

  ngOnDestroy(): void {
    //localStorage.setItem('timetabeStart', localStorage.getItem('calendarStart'))  //не работает
  }

}
