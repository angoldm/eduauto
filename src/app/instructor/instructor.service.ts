import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import { find, first, map, tap, catchError } from 'rxjs/operators';
import { InstructorsService } from '../instructors/instructors.service';
import { Instructor } from '../instructor';
import { Instructors } from '../instructors';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {

  constructor(private http: HttpClient) { }
  
  getInstructor(id:number) : Observable<Instructor>{
    const href = 'assets/instructor.json';
    const requestUrl =`${href}`;  //  /*?id=${id}
    return this.http.get('assets/instructor.json').pipe(
      map((instr: any) => {
          let instructor = instr.instructor;
          return {  //можно запросить неполный список
            id: instructor.id, 
            name: instructor.name, 
            surname: instructor.surname, 
            experience: instructor.experience,
            brand: "", //instructor.brand,
            model:  "", //instructor.model,
            autotransmission: false,
            statenumber: "",
            school: instructor.school,
          };
      }),
    );
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
