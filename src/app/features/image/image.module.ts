import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageComponent } from './image.component';
import { RouterModule, Routes } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BarChartModule, NumberCardModule } from '@swimlane/ngx-charts';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

const routes: Routes = [
  {
    path: '',
    component: ImageComponent,
  },
];

@NgModule({
  declarations: [ImageComponent],
  imports: [CommonModule, RouterModule.forChild(routes), MatSnackBarModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, NumberCardModule, BarChartModule, MatTableModule, MatIconModule],
  exports: [ImageComponent],
})
export class ImageModule {}
