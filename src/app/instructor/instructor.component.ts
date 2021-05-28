import { Component, AfterViewInit,  OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, FullCalendarComponent } from '@fullcalendar/angular'; // useful for typechecking
import ruLocale from '@fullcalendar/core/locales/ru';
import { createEventId, DateInfo } from '../utils/event-utils';
import {Instructor} from '../instructor';
import { InstructorService } from '../instructor/instructor.service';
import { Timerecord, TimetableService } from '../timetable/timetable.service';
import { MessageService } from '../message.service';
import { formatDate } from '@angular/common';
import {AuthenticationService} from '../auth/authentication.service';

@Component({
  selector: 'instructor',
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.scss']
})
export class InstructorComponent implements AfterViewInit, OnInit {

  instructor: Instructor;
  id: number;

  private subscription: Subscription;
  timetable: Timerecord[]

  /**TODO: Избавиться от зависимости calendarVisible при выводе записей*/
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

  constructor(private route: ActivatedRoute, 
    private instrService: InstructorService, 
    private timetableService: TimetableService, 
    private authenticationService: AuthenticationService, 
    private messageService: MessageService
  ){
    //this.route.params.subscribe(params=>this.instructor = this.instrService!.getInstructor(params['id']));
    /*this.route.params.subscribe(params=>{
      this.id=params['id'];
      console.log("id:" +  params['id']);
    })*/
  }

  ngAfterViewInit(): void {
    this.calendarApi = this.calendarComponent.getApi();
  }

  ngOnInit(): void {
    //const id = +this.route.snapshot.params['id']
    const id = this.route.snapshot.params['id']
    this.instrService.getInstructor(id)
      .subscribe((instr: Instructor) => {
        this.instructor = instr;
        console.log("instructor.id:" +  this.instructor.id);
      });
    //console.log("Instructor:" +  this.instructor);
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
      this.getTimetable(dateInfo.start)
      localStorage.setItem('timetabeStart', formatDate(dateInfo.start, 'YYYY-MM-dd', 'en-US'))
    //} else localStorage.removeItem('isInit')
    //localStorage.setItem('timetabeStart', formatDate(this.calendarApi.getDate(), 'YYYY-MM-dd', 'en-US'))
  }

  getTimetable(satartDate: Date): void {
    this.timetable = []
    this.timetableService.getTimetableRange(satartDate, this.instructor.id
      )
      .subscribe(timetable => {
        //this.messageService.add(`Загружена ${timetable[0].name}`)
        //this.timetable = this.timetable.concat(timetable[0])
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

}
