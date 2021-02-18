import { Inject, Injectable, NgModule, Optional } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { Request } from 'express';
import { REQUEST } from '@nguniversal/express-engine/tokens';
//import { CookieService } from 'ngx-cookie-service';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { CookieService } from './cookie.service';

@Injectable()
export class RequestCookies {
    constructor(@Optional() @Inject(REQUEST) private request: Request) {}

    get cookies() {
        return !!this.request.headers.cookie ? this.request.headers.cookie : null;
    }
}

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule
  ],
  providers: [
    CookieService,
    { provide: 'req', useClass: RequestCookies }
],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
