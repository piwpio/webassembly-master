import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FibonacciComponent } from './fibonacci.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Routes } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BarChartModule, NumberCardModule } from '@swimlane/ngx-charts';

const routes: Routes = [
  {
    path: '',
    component: FibonacciComponent,
  },
];
@NgModule({
  declarations: [FibonacciComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTableModule,
    MatProgressSpinnerModule,
    NumberCardModule,
    BarChartModule,
  ],
  exports: [FibonacciComponent],
})
export class FibonacciModule {}
