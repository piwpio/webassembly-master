import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AppHeaderModule } from '@components/app-header/app-header.module';
import { AppMenuModule } from '@components/app-menu/app-menu.module';
import { WebassemblyService } from '@services/webassembly.service';
import { HttpClientModule } from '@angular/common/http';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { SocketService } from '@services/socket.service';
import { ServerReadyService } from '@services/server-ready.service';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { ResultsModule } from '@components/results/results.module';

const config: SocketIoConfig = { url: 'http://localhost:3000' };

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    AppHeaderModule,
    AppMenuModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    MatSnackBarModule,
    ResultsModule,
  ],
  providers: [
    WebassemblyService,
    SocketService,
    ServerReadyService,
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2000 } },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
