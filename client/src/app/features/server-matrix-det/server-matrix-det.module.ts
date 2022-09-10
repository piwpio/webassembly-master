import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ResultsModule } from '@components/results/results.module';
import { ServerMatrixDetComponent } from '@features/server-matrix-det/server-matrix-det.component';

const routes: Routes = [
  {
    path: '',
    component: ServerMatrixDetComponent,
  },
];

@NgModule({
  declarations: [ServerMatrixDetComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ResultsModule,
  ],
})
export class ServerMatrixDetModule {}