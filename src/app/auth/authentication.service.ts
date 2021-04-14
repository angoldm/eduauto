import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

import { User } from './user';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
//import { REQUEST } from '@nguniversal/express-engine/tokens';
//import { Request } from 'express';
import { CookieServer } from '../cookie.service';

const AUTH_KEY = makeStateKey('auth_data');

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    //private cookieStore: {};
    currentUsertoken: string = '';
    currentUserInfo: User;

    constructor(private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId,
        private transferState: TransferState,
        private cookieService: CookieService,
        private cookieServer: CookieServer,
        //@Optional() @Inject(REQUEST) private request: Request,
    ) {
        //let currentUserJSON = isPlatformBrowser(this.platformId) ? localStorage.getItem('currentUser') : request.http.cookie
        let user: User = {
            username: 'test',
            password: 'test',
            fio: '',
            token: ''
        };
        if (isPlatformServer(this.platformId)) {
            //console.log(this.request.headers.cookie);
            //this.parseCookies(this.request.headers.cookie);
            //console.log(this.cookieStore);
            //console.log(this.getCookie('currentUser'));
            //user.token = this.getCookie('currentUserToken');
            user.token = this.cookieServer.get('currentUserToken');
            console.log(`Server currentUserToken = ${user.token}`);
        } else user.token = localStorage.getItem("currentUserToken");
        //let currentUser:User = isPlatformBrowser(this.platformId) ? JSON.parse(localStorage.getItem('currentUser')) : user;
        let currentUser = user;
        /*let currentUserCookie = this.cookieService.get('currentUser');
        let currentUser = JSON.parse(currentUserCookie);*/
        this.currentUserSubject = new BehaviorSubject<User>(currentUser);
        this.currentUser = this.currentUserSubject.asObservable();
        this.currentUserInfo = currentUser;
    }

    public get currentUserValue(): User {
        //return this.currentUserSubject.value;
        return this.currentUserInfo;
    }

    login(username: string, password: string) {
        //RegistryClient/RegClient
        if (this.transferState.hasKey(AUTH_KEY)) {
            let authdata = this.transferState.get(AUTH_KEY, null);
            let user = JSON.parse(authdata)
            localStorage.setItem('currentUser', authdata);
            this.currentUserSubject.next(user);
            return of(user);
        } else {
            /*return this.http.post<any>(`${environment.apiUrl}RegistryClient/RegClient`, { Login: username, Parol: password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                if (isPlatformServer(this.platformId)) {
                    this.transferState.set(AUTH_KEY, JSON.stringify(user));
                    console.log("Запрос от сервера: ${user}");
                }
                return user;
            }));*/
            let fio = `${username}:${password}`;
            let token = btoa(`${username}:${password}`);
            let user: User = {
                username: username,
                password: password,
                fio: fio,
                token: token
            };
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('currentUserToken', user.token);
            this.transferState.set(AUTH_KEY, JSON.stringify(user));
            this.cookieService.set('currentUser', JSON.stringify(user));
            //this.cookieService.set('currentUserToken', user.token);
            this.cookieServer.set('currentUserToken', user.token);
            this.currentUserSubject.next(user);
            return of(user);
        }
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
    /*public parseCookies(cookies) {
        this.cookieStore = {};
        if (!!cookies === false) { return; }
        let cookiesArr = cookies.split('; ');
        for (const cookie of cookiesArr) {
            const cookieArr = cookie.split('=');
            this.cookieStore[cookieArr[0]] = cookieArr[1];
        }
    }*/

    /*getCookie(key: string) {
        return !!this.cookieStore[key] ? this.cookieStore[key] : null;
    }*/
}
