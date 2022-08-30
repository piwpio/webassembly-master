import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EdtestComponent } from '@features/edtest/edtest.component';

const routes: Routes = [
  {
    path: '',
    component: EdtestComponent,
  },
];

@NgModule({
  declarations: [EdtestComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [EdtestComponent],
})
export class EdtestModule {}
