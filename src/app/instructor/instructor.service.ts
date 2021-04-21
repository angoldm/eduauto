import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import { find, first, map, tap, catchError } from 'rxjs/operators';
import { InstructorsService } from '../instructors/instructors.service';
import { Instructor } from '../instructor';
import { InstructorstblItem, InstructorsInfo } from '../instructors/instructors.service'
import { Instructors } from '../instructors';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {

  constructor(private http: HttpClient, private instrService: InstructorsService) { }

  getInstructor(id:string) : Observable<Instructor>{
    return this.instrService.getAllInstructors().pipe(
      map((data:InstructorsInfo) => {
        return data.instructors.find(instructor => instructor.id == id);
      }),
      map((instr: InstructorstblItem) => {
          return {  //можно запросить неполный список
            id: instr.id,
            name: instr.name,
            surname: "",
            experience: instr.experience,
            mark: instr.mark,
            model: instr.model,
            transmission: instr.transmission,
            statenumber: "",
            school: instr.school,
          };
      }),
    );

    /*
    const href = 'assets/instructor.json';
    const requestUrl =`${href}`;  //  /*?id=${id}
    return this.http.get(`${environment.apiUrl}Instructors/GetInstructor`).pipe(
      map((instr: any) => {
          let instructor = instr.instructor;
          return {  //можно запросить неполный список
            id: instructor.id,
            name: instructor.name,
            surname: instructor.surname,
            experience: instructor.experience,
            mark: "", //instructor.mark,
            model:  "", //instructor.model,
            autotransmission: false,
            statenumber: "",
            school: instructor.school,
          };
      }),
    );*/
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      //this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
