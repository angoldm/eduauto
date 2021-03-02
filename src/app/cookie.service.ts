import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class CookieServer {
    private cookieStore = {};

    constructor(
        @Inject('req') private readonly req: any,
        @Inject(PLATFORM_ID) private platformId,
        private cookieService: CookieService,
    ) {
        if (this.req !== null) {
            //console.log(`Server cookies from CookieServer module = ${this.req.cookies}`);
            this.parseCookies(this.req.cookies);
            //console.log(`Server cookie = ${this.cookieStore['currentUserToken']}`);
        } else {
            this.parseCookies(document.cookie);
        }
    }

    public parseCookies(cookies) {
        this.cookieStore = {};
        if (!!cookies === false) { return; }
        let cookiesArr = cookies.split('; ');
        for (const cookie of cookiesArr) {
            const cookieArr = cookie.split('=');
            this.cookieStore[cookieArr[0]] = cookieArr[1];
        }
    }

    get(key: string) {
        return !!this.cookieStore[key] ? this.cookieStore[key] : null;
    }

    set(key: string, value: string) {
        //this.cookieStore[key] = value;
        if (isPlatformBrowser(this.platformId))
            this.cookieService.set(key, value);
    }
}
