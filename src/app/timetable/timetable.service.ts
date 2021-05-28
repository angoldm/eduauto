import { DatePipe, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concat, forkJoin, merge, Observable, of } from 'rxjs';
import { buffer, catchError, concatAll, filter, map, mergeMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MessageService } from '../message.service';
import { getDatefromStr, handleError } from '../utils/api-utils';

export interface Timerecord {
  begin: Date,
  end: Date,
  name: string,
  vid: string
}

@Injectable({
  providedIn: 'root'
})
export class TimetableService {

  constructor(private http: HttpClient,
    private messageService: MessageService) { }

  /**
   * 
   * @param startDate:Date
   * @returns Observable
   */
  getTimetableRange(startDate:Date, instructorId:string): Observable<Timerecord[][]> {
    //startDate = new Date('2021-05-20')
    //let timetable: Observable<Timerecord[]> = this.getTimetable(startDate)
    let timetables: Observable<Timerecord[]>[] = new Array(7)
    let nextDay: Date = new Date(startDate.toString())
    //for (var i:number = 1; i<7; i++) {
    for (var i:number = 0; i<7; i++) {
      /*nextDay.setDate(nextDay.getDate() + 1)
      let timetableNext: Observable<Timerecord[]> = this.getTimetable(nextDay)
      timetable = merge(timetable, timetableNext)*/
      timetables[i] = this.getTimetable(nextDay, instructorId)
      nextDay.setDate(nextDay.getDate() + 1)
    }
    //let timetable = concat(timetableNext[0], timetableNext[1], timetableNext[2], timetableNext[3], timetableNext[4], timetableNext[5], timetableNext[6])
    return forkJoin(timetables)
    .pipe(
      //concatAll()//превращает в тип Observable<Timerecord>
      //tap(trec => this.log(`Загружено записей: ${trec.length}`)),
    );
  }
  
  getTimetable(dateRec:Date, instructorId:string): Observable<Timerecord[]> {
    let dateRecStr: string = formatDate(dateRec, 'YYYYMMdd', 'en-US')
    //dateRecStr = '20210521'
    /*const datepipe: DatePipe = new DatePipe('en-US')
    let dateRecStr: string = datepipe.transform(dateRec, 'YYYYMMdd')*/
    //let start: string = `${satartDate.getFullYear()}${satartDate.getMonth()}${satartDate.getDate()}`
    return this.http.get<Timerecord[]>(`${environment.apiUrl}Timetable/GetTime?Instructor=${instructorId}&Date=${dateRecStr}`)  //&Login=${login}&Parol=${password}
    .pipe(
      //tap(trec => this.log(`Загружено записей: ${trec.length}`)),
      catchError(this.handleError<Timerecord[]>('Записи календаря инструктора: Не загружены.', [])),
      map((records:Timerecord[]) => records.map((rec:any) => {
        return {
          begin: getDatefromStr(rec.begin),
          end: getDatefromStr(rec.end),
          name: rec.name,
          vid: rec.vid
        }
      }))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'Операциия', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} Ошибка: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`${message}`);
  }

}
