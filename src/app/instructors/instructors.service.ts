import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { ThrowStmt } from '@angular/compiler';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

const INSTRS_KEY = makeStateKey('instructors');

export interface InstructorstblItem {
  name: string;
  id: number;
  surname: string;
  experience: number;
  license: string;
  brand: string;
  model: string;
  autotransmission: boolean;
  statenumber: string;
  school: string;
  city: string;
}

export interface InstructorsInfo {
  instructors:InstructorstblItem[];
  total_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class InstructorsService {

  sort: string;
  order: string;
  constructor(private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId,
    private transferState: TransferState) { }

//  getInstructors() : Observable<Instructor[]> {
  getInstructors0(sort?: string, order?: string, pageIndex?: number, pageSize?: number) : Observable<InstructorsInfo> {
    this.sort = sort;
    this.order = order;
    if (this.transferState.hasKey(INSTRS_KEY)) {
      const instrs = this.transferState.get(INSTRS_KEY, null);
      //this.transferState.remove(INSTRS_KEY);
      return of(instrs);
    } else {
      //return this.http.get('assets/instructors.json').pipe(
      //return this.http.get('/api/Instructors/GetInstructors').pipe(
      //return this.http.get('https://app108060.1capp.net/Avtoshkola/hs/Instructors/GetInstructors').pipe(
      let instrUrl = environment.apiUrl + 'Instructors/GetInstructors';
      return this.http.get(instrUrl).pipe(
        map((data:any) => {
          //let instructorsList = data["instructors"];
          //return instructorsList.map(function(instructor:any) {
          return {instructors: data
            .sort((a, b) => {
              const isAsc = order === 'asc';
              switch (sort) {
                //case 'surname': return compare(a.surname, b.surname, isAsc);
                case 'id': return compare(+a.id, +b.id, isAsc);
                case 'name': return compare(a.name, b.name, isAsc);
                case 'school': return compare(a.school, b.school, isAsc);
                //case 'city': return compare(a.city, b.city, isAsc);
                default: return 0;
              }
            }
            )
            .slice(pageIndex*pageSize, pageIndex*pageSize+pageSize)
            .map((instructor: InstructorstblItem) => {
              return {  //можно запросить неполный список
                id: instructor.id,
                name: instructor.name,
                //surname: instructor.surname,
                experience: instructor.experience,
                brand: "", //instructor.brand,
                model:  "", //instructor.model,
                autotransmission: false,
                statenumber: "",
                school: instructor.school,
                city: instructor.city,
              };
            }),
            total_count: data.length
          };
        }),
        tap(instr => {
          if (isPlatformServer(this.platformId)) {
              this.transferState.set(INSTRS_KEY, instr);
              //console.log("Запрос от сервера: $instr");
          }
        })
      );
    }
  }

  getInstructors(sort?: string, order?: string, pageIndex?: number, pageSize?: number) : Observable<InstructorsInfo> {
    this.sort = sort;
    this.order = order;
      let instrUrl = environment.apiUrl + 'Instructors/GetInstructors';
      return this.getAllInstructors().pipe(
        map((data:any) => {
          //let instructorsList = data["instructors"];
          //return instructorsList.map(function(instructor:any) {
          return {instructors: data.instructors
            .sort((a, b) => {
              const isAsc = order === 'asc';
              switch (sort) {
                //case 'surname': return compare(a.surname, b.surname, isAsc);
                case 'id': return compare(+a.id, +b.id, isAsc);
                case 'name': return compare(a.name, b.name, isAsc);
                case 'school': return compare(a.school, b.school, isAsc);
                //case 'city': return compare(a.city, b.city, isAsc);
                default: return 0;
              }
            })
            .slice(pageIndex*pageSize, pageIndex*pageSize+pageSize),
            total_count: data.total_count
            };
          })
      );
  }

  getAllInstructors() : Observable<InstructorsInfo> {
    if (isPlatformBrowser(this.platformId) && this.transferState.hasKey(INSTRS_KEY)) {
      //if (this.transferState.hasKey(INSTRS_KEY)) {
        //const instrs = this.transferState.get(INSTRS_KEY, null);
        //this.transferState.remove(INSTRS_KEY);

        return of(this.transferState.get(INSTRS_KEY, null));
      /*} /*else {
        location.reload();
      }*/
    } else {
      //return this.http.get('assets/instructors.json').pipe(
      //return this.http.get('/api/Instructors/GetInstructors').pipe(
      //return this.http.get('https://app108060.1capp.net/Avtoshkola/hs/Instructors/GetInstructors').pipe(
      //let instrUrl = environment.apiUrl + 'Instructors/GetInstructors';
      if (isPlatformServer(this.platformId)) this.transferState.set(INSTRS_KEY, null);
      return this.http.get(`${environment.apiUrl}Instructors/GetInstructors`).pipe(
        map((data:any) => {
          //let instructorsList = data["instructors"];
          //return instructorsList.map(function(instructor:any) {
          return {instructors: data
            .map((instructor: InstructorstblItem) => {
              return {  //можно запросить неполный список
                id: instructor.id,
                name: instructor.name,
                //surname: instructor.surname,
                experience: instructor.experience,
                brand: "", //instructor.brand,
                model:  "", //instructor.model,
                autotransmission: false,
                statenumber: "",
                school: instructor.school,
                city: instructor.city,
              };
            }),
            total_count: data.length
          };
        }),
        tap(instr => {
          if (isPlatformServer(this.platformId)) {
              this.transferState.set(INSTRS_KEY, instr);
              console.log("Запрос от сервера: $instr");
          }
        })
      );
    }
  }

  getTransferState(){
    return this.transferState.get(INSTRS_KEY, null);
  }

  private getSortedData(data: InstructorstblItem[]) {
    if (!this.sort || this.order === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.order === 'asc';
      switch (this.sort) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'surname': return compare(a.surname, b.surname, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        case 'name': return compare(a.name, b.name, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
