import { Inject, Injectable, NgModule, Optional } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { Request } from 'express';
import { REQUEST } from '@nguniversal/express-engine/tokens';
//import { CookieService } from 'ngx-cookie-service';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { CookieServer } from './cookie.service';

@Injectable()
export class RequestCookies {
    constructor(@Optional() @Inject(REQUEST) private request: Request) {}

    get cookies() {
      //console.log(`Server cookies from Server module = ${this.request.headers.cookie}`);
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
    CookieServer,
    { provide: 'req', useClass: RequestCookies }
],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
