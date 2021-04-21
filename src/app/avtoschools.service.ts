import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './auth/authentication.service'

export interface Avtoschool {
  result: string,
  name:string,
  id: string,
  boss: string,
  city: string,
}

@Injectable({
  providedIn: 'root'
})
export class AvtoschoolsService {

  Schools : Map<string, Avtoschool>;

  constructor(private http: HttpClient,
      private authenticationService: AuthenticationService
    ) {
        this.Schools = new Map<string, Avtoschool>();
        this.authenticationService.currentUser.subscribe(user => {
          if (user != null)
            this.getAvtoschools().subscribe(ss => ss.forEach( s =>
              this.Schools[s.id] = s
            ));
        })
   }

  getSchoolname(id:string) :string {
    return this.Schools[id] ? this.Schools[id]['name'] : id;
  }

  getAvtoschools() : Observable<Avtoschool[]> {
    return this.http.get<Avtoschool[]>(`${environment.apiUrl}Avtoschool/GetAvtoschool`)
  }
}
