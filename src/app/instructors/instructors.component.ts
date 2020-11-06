import { Component, OnInit } from '@angular/core';
import {Instructor} from '../instructor';
import { InstructorsService } from './instructors.service';
import { Router} from '@angular/router';
/*import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';*/

@Component({
  selector: 'instructors',
  templateUrl: './instructors.component.html',
  styleUrls: ['./instructors.component.css'],
  providers: [InstructorsService]
})
export class InstructorsComponent implements OnInit {

  instructors: Instructor[]=[];

  constructor(private instrService: InstructorsService, private router: Router) { }

  ngOnInit(): void {
    this.instrService.getInstructors().subscribe(data => this.instructors=data.instructors);
  };
  goToInstructor(instructor: Instructor){
             
    this.router.navigate(
        ['/instructor', instructor.id], 
        {
            queryParams:{
            }
        }
    );
  }
}