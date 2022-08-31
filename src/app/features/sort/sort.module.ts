import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SortComponent } from '@features/sort/sort.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';

const routes: Routes = [
  {
    path: '',
    component: SortComponent,
  },
];

@NgModule({
  declarations: [SortComponent],
  imports: [CommonModule, RouterModule.forChild(routes), MatSnackBarModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatProgressSpinnerModule, MatTableModule],
  exports: [SortComponent],
})
export class SortModule {}
