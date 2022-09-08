import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent {
  @Input() isRunning: boolean;
  @Input() chartBarsResults;
  @Input() chartBlockResults;
  constructor() {}
}
