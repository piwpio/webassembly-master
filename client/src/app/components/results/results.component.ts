import { Component, Input } from '@angular/core';
import { getRowClass } from '@services/utils';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent {
  @Input() isRunning: boolean;
  @Input() chartBarsResults;
  @Input() chartBlockResults;
  @Input() tablePreparedResults;
  @Input() tableDisplayedColumns;
  @Input() tableDisplayedColumnsWithTestNo;
  @Input() allResults;

  getRowClass = getRowClass;
  constructor() {}
}
