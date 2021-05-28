import { Observable, of } from "rxjs";

export function getDatefromStr(strDate:string): Date{
    let year = strDate.substr(6, 4);
    let month = strDate.substr(3, 2);
    let day = strDate.substr(0, 2);
    let time = strDate.substr(11, 8);
    return new Date(`${year}-${month}-${day}T${time.length==7 ? '0' : ''}${time}`)
  }

/**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  export function handleError<T>(operation = 'Операциия', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    log(`${operation} Ошибка: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}
function log(message: string) {
  this.messageService.add(`${message}`);
}