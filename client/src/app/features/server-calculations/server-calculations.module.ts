import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServerCalculationsComponent } from './server-calculations.component';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ResultsModule } from '@components/results/results.module';

const routes: Routes = [
  {
    path: ':test',
    component: ServerCalculationsComponent,
  },
];

@NgModule({
  declarations: [ServerCalculationsComponent],
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
export class ServerCalculationsModule {}
