import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { map, take, skip } from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler';

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
  constructor(private http: HttpClient) { }

//  getInstructors() : Observable<Instructor[]> {
  getInstructors(sort?: string, order?: string, pageIndex?: number, pageSize?: number) : Observable<InstructorsInfo> {
    this.sort = sort;
    this.order = order;
    return this.http.get('assets/instructors.json').pipe(
      map((data:any) => {
        //let instructorsList = data["instructors"];
        //return instructorsList.map(function(instructor:any) {
        return {instructors: data["instructors"]
          .slice(0, pageSize)
          .sort((a, b) => {
            const isAsc = order === 'asc';
            switch (sort) {
              case 'name': return compare(a.name, b.name, isAsc);
              case 'surname': return compare(a.surname, b.surname, isAsc);
              case 'id': return compare(+a.id, +b.id, isAsc);
              case 'name': return compare(a.name, b.name, isAsc);
              case 'school': return compare(a.school, b.school, isAsc);
              default: return 0;
            }
          }
        )
          .map((instructor: InstructorstblItem) => {
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
          total_count: data.total_count
        };
      })
    );
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