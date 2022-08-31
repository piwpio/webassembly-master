import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SortComponent } from '@features/sort/sort.component';

const routes: Routes = [
  {
    path: '',
    component: SortComponent,
  },
];

@NgModule({
  declarations: [SortComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [SortComponent],
})
export class SortModule {}
