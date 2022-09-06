import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppHeaderComponent } from './app-header.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [AppHeaderComponent],
  exports: [AppHeaderComponent],
  imports: [CommonModule, MatIconModule, MatButtonModule],
})
export class AppHeaderModule {}
