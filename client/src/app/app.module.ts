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
  ],
  providers: [WebassemblyService],
  bootstrap: [AppComponent],
})
export class AppModule {}
