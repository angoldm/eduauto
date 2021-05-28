import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MessageService } from '../message.service';
import { getDatefromStr, handleError } from '../utils/api-utils';

enum VidreqStatus {
  SENDED = "Отправлена",
  CONFIRMED = "Подтверждена",
  REFUSED = "Отказ"
}

export interface ReqStatus {
  begin: Date,
  answer: Date,
  vid: string,
  instructorId: string
}

@Injectable({
  providedIn: 'root'
})
export class ReqStatusService {

  constructor(private http: HttpClient,
    private messageService: MessageService
  ) { }

  getReqStatus(): Observable<ReqStatus[]> {
    return this.http.get<ReqStatus[]>(`${environment.apiUrl}Request/GetRequest`)
    .pipe(
      //tap(trec => this.log(`Загружено записей: ${trec.length}`)),
      catchError(this.handleError<ReqStatus[]>('Информация по заявкам Не загружена.', [])),
      map((reqStatus:ReqStatus[]) => reqStatus.map((req:any) => {
        return {
          begin: getDatefromStr(req.begin),
          answer: getDatefromStr(req.answer),
          vid: req.vid,
          instructorId: req.instructorId
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
