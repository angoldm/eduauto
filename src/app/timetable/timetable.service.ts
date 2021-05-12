import { DatePipe, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concat, merge, Observable, of } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MessageService } from '../message.service';

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
   * TODO: concatenate this merge of Observables into one Observable to get one Observable
   */
  getTimetableRange(startDate:Date): Observable<Timerecord[]> {
    //startDate = new Date('2021-05-20')
    //let timetable: Observable<Timerecord[]> = this.getTimetable(startDate)
    let timetableNext: Observable<Timerecord[]>[] = new Array(7)
    let nextDay: Date = new Date(startDate.toString())
    //for (var i:number = 1; i<7; i++) {
    for (var i:number = 0; i<7; i++) {
      /*nextDay.setDate(nextDay.getDate() + 1)
      let timetableNext: Observable<Timerecord[]> = this.getTimetable(nextDay)
      timetable = merge(timetable, timetableNext)*/
      timetableNext[i] = this.getTimetable(nextDay)
      nextDay.setDate(nextDay.getDate() + 1)
    }
    let timetable = concat(timetableNext[0], timetableNext[1], timetableNext[2], timetableNext[3], timetableNext[4], timetableNext[5], timetableNext[6])
    return timetable.pipe(
      //tap(trec => this.log(`Загружено записей: ${trec.length}`)),
    );
  }
  
  getTimetable(dateRec:Date): Observable<Timerecord[]> {
    let dateRecStr: string = formatDate(dateRec, 'YYYYMMdd', 'en-US')
    //dateRecStr = '20210521'
    /*const datepipe: DatePipe = new DatePipe('en-US')
    let dateRecStr: string = datepipe.transform(dateRec, 'YYYYMMdd')*/
    //let start: string = `${satartDate.getFullYear()}${satartDate.getMonth()}${satartDate.getDate()}`
    return this.http.get<Timerecord[]>(`${environment.apiUrl}Timetable/GetTime?Instructor=aa2b4b99-f3c6-11e9-b7f1-d6d62339e3ad&Date=${dateRecStr}&Login=+7(917)2222222&Parol=1`)
    .pipe(
      //tap(trec => this.log(`Загружено записей: ${trec.length}`)),
      catchError(this.handleError<Timerecord[]>('Не загружены.', []))
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
    this.messageService.add(`Записи календаря инструктора: ${message}`);
  }

}
