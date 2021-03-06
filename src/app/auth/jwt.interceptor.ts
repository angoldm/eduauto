import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from './authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        /*request = request.clone({
            setHeaders: {
                "X-Requested-With": "XMLHttpRequest"
            }
        });*/
        let currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.token ) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Basic ${currentUser.token}`,
                    'Accept-Charset': 'utf-8'
                },
                setParams: {
                    Login: currentUser.username,
                    Parol: currentUser.password
                }
            });
        }
        //console.log(`currentUser.token = ${currentUser.token}`);

        return next.handle(request);
    }
}
