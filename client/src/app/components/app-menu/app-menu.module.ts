import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMenuComponent } from './app-menu.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppMenuComponent],
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterModule],
  exports: [AppMenuComponent],
})
export class AppMenuModule {}
