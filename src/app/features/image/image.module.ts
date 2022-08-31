import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageComponent } from './image.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ImageComponent,
  },
];

@NgModule({
  declarations: [ImageComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [ImageComponent],
})
export class ImageModule {}