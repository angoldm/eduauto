import { Component, AfterViewInit,  OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/angular'; // useful for typechecking
import { INITIAL_EVENTS, createEventId } from '../event-utils';

import {Instructor} from '../instructor';
import { InstructorService } from '../instructor/instructor.service';

@Component({
  selector: 'instructor',
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.scss']
})
export class InstructorComponent implements AfterViewInit, OnInit {

  instructor: Instructor;
  id: number;

  private subscription: Subscription;
  calendarVisible = true;
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
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
};

  constructor(private route: ActivatedRoute, private instrService: InstructorService){
    //this.route.params.subscribe(params=>this.instructor = this.instrService!.getInstructor(params['id']));
    /*this.route.params.subscribe(params=>{
      this.id=params['id'];
      console.log("id:" +  params['id']);
    })*/
  }

  ngAfterViewInit(): void {
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

  currentEvents: EventApi[] = [];

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
