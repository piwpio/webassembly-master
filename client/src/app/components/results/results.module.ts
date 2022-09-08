import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultsComponent } from './results.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { BarChartModule, NumberCardModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [ResultsComponent],
  imports: [CommonModule, MatProgressSpinnerModule, MatTableModule, BarChartModule, NumberCardModule],
  exports: [ResultsComponent],
})
export class ResultsModule {}
