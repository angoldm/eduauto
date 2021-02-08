import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpClientJsonpModule} from '@angular/common/http';
import {Observable} from 'rxjs';
import { map, take, skip } from 'rxjs/operators';
import { environment } from './../environments/environment';

interface City {
  result: boolean;
  name: string;
}
@Injectable({
  providedIn: 'root'
})
export class CityesService {
  constructor(private http: HttpClient) {
    console.log('environment.apiUrl = "'+environment.apiUrl+'"');
  }
  getCities(): Observable<string[]>{
  let httpOptions: Object = {
    headers: new HttpHeaders({
      /*Login: "test",
      Parol: "test",*/
      Authorization: 'Basic dGVzdDp0ZXN0',
      //'Content-Type':  'text/plain',
      //'Content-Type':  'application/json',
      /*'Access-Control-Allow-Origin': '*',
      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT"*/
//'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
/*'Accept-Encoding': 'gzip, deflate, br',
'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
'Authorization': 'Basic dGVzdDp0ZXN0',
'Cache-Control': 'max-age=0',
'Connection': 'keep-alive',
'DNT': '1',
'Host': 'app108060.1capp.net',
'Sec-Fetch-Dest': 'document',
'Sec-Fetch-Mode': 'navigate',
'Sec-Fetch-Site': 'none',
'Sec-Fetch-User': '?1',
'Upgrade-Insecure-Requests': '1',
'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36'*/
    }),
    //responseType: 'text' as const
  };
  let httpUrl = environment.apiUrl + 'City/GetCity';
  return this.http.get<City>(httpUrl, httpOptions) //jsonp, httpOptions
    .pipe(
      map((data:any) => {
        return data.map((city: City) => {
          return city.name
        }
        )
      })
    );
  }
  callback(){};
}
