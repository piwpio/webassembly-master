import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SocketService } from '@services/socket.service';
import {
  SocketMessageStatus,
  SocketMessageTestData,
  SocketMessageTestType,
  TestResults,
} from '@models/server-data.model';
import { ServerReadyService } from '@services/server-ready.service';
import { filter, takeUntil } from 'rxjs/operators';
import { getAverage, getFastest, getMedian, getSlowest, round2 } from '@services/utils';

@Component({
  selector: 'app-base-server-test',
  template: '',
})
export abstract class BaseServerTestComponent implements OnInit, OnDestroy {
  testType: SocketMessageTestType;
  isReadyForNextTest = false;
  isRunning = false;

  tableDisplayedColumns = null;
  tableDisplayedColumnsWithTestNo = null;
  tablePreparedResults = null;
  chartBlockResults = null;
  chartBarsResults = null;
  allResults = null;

  private $destroy: Subject<boolean> = new Subject<boolean>();

  protected constructor(
    protected readonly socketService: SocketService,
    protected readonly serverReadyService: ServerReadyService,
    protected readonly chRef: ChangeDetectorRef
  ) {
    // Allow to perform tests if possible
    this.serverReadyService
      .onReady()
      .pipe(takeUntil(this.$destroy))
      .subscribe((isReady) => {
        this.setIsReadyForNextTest(isReady);
      });

    // Check once if component test type is ready and show results if yes.
    this.socketService
      .startListeningOn<SocketMessageStatus>('status')
      .pipe(
        takeUntil(this.$destroy),
        filter((status) => !!status?.testType),
        filter((status) => status.testType === this.testType)
      )
      .subscribe((payload) => {
        console.log(payload);
        this.isRunning = !payload.isReady;
        if (payload.testResults) {
          this.prepareResults(payload.testResults);
        }
      });
  }

  ngOnInit(): void {
    this.socketService.emitGetStatus();
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
  }

  abstract getTestData(): SocketMessageTestData;

  runTest(): void {
    const testData = this.getTestData();
    if (testData) {
      this.tableDisplayedColumns = null;
      this.tableDisplayedColumnsWithTestNo = null;
      this.tablePreparedResults = null;
      this.allResults = null;
      this.chartBarsResults = null;
      this.chartBlockResults = null;
      this.socketService.emitNewTest(testData);
    }
  }

  private setIsReadyForNextTest(isReady: boolean): void {
    this.isReadyForNextTest = isReady;
    this.chRef.markForCheck();
  }

  private prepareResults(results: TestResults[]): void {
    for (const r of results) {
      if (!r) continue;

      r.memory = r.memory.map((m) => round2(m));
      r.performance = r.performance.map((m) => round2(m));

      if (!this.allResults) {
        this.allResults = {
          memory: { combined: [] },
          performance: { combined: [] },
        };
      }
      this.allResults.memory.combined = [...this.allResults.memory.combined, ...r.memory];
      this.allResults.performance.combined = [...this.allResults.performance.combined, ...r.performance];

      if (!this.chartBarsResults) {
        this.chartBarsResults = {
          memory: [
            { name: 'Best', series: [] },
            { name: 'Worst', series: [] },
            { name: 'Average', series: [] },
            { name: 'Median', series: [] },
          ],
          performance: [
            { name: 'Best', series: [] },
            { name: 'Worst', series: [] },
            { name: 'Average', series: [] },
            { name: 'Median', series: [] },
          ],
        };
      }

      this.chartBarsResults.memory[0].series.push({ name: r.testLabel, value: getFastest(r.memory) });
      this.chartBarsResults.memory[1].series.push({ name: r.testLabel, value: getSlowest(r.memory) });
      this.chartBarsResults.memory[2].series.push({ name: r.testLabel, value: getAverage(r.memory) });
      this.chartBarsResults.memory[3].series.push({ name: r.testLabel, value: getMedian(r.memory) });
      this.chartBarsResults.performance[0].series.push({ name: r.testLabel, value: getFastest(r.performance) });
      this.chartBarsResults.performance[1].series.push({ name: r.testLabel, value: getSlowest(r.performance) });
      this.chartBarsResults.performance[2].series.push({ name: r.testLabel, value: getAverage(r.performance) });
      this.chartBarsResults.performance[3].series.push({ name: r.testLabel, value: getMedian(r.performance) });

      if (!this.chartBlockResults) {
        this.chartBlockResults = {
          memory: {},
          performance: {},
        };
      }
      this.chartBlockResults.memory[r.testIndex] = [];
      this.chartBlockResults.performance[r.testIndex] = [];

      this.chartBlockResults.memory[r.testIndex].push({ name: `Best ${r.testLabel}`, value: getFastest(r.memory) });
      this.chartBlockResults.memory[r.testIndex].push({ name: `Worst ${r.testLabel}`, value: getSlowest(r.memory) });
      this.chartBlockResults.memory[r.testIndex].push({ name: `Average ${r.testLabel}`, value: getAverage(r.memory) });
      this.chartBlockResults.memory[r.testIndex].push({ name: `Median ${r.testLabel}`, value: getMedian(r.memory) });
      this.chartBlockResults.performance[r.testIndex].push({
        name: `Best ${r.testLabel}`,
        value: getFastest(r.performance),
      });
      this.chartBlockResults.performance[r.testIndex].push({
        name: `Worst ${r.testLabel}`,
        value: getSlowest(r.performance),
      });
      this.chartBlockResults.performance[r.testIndex].push({
        name: `Average ${r.testLabel}`,
        value: getAverage(r.performance),
      });
      this.chartBlockResults.performance[r.testIndex].push({
        name: `Median ${r.testLabel}`,
        value: getMedian(r.performance),
      });

      if (!this.tableDisplayedColumns) {
        this.tableDisplayedColumns = [];
        this.tableDisplayedColumnsWithTestNo = ['testNo'];
      }
      this.tableDisplayedColumns.push(r.testLabel);
      this.tableDisplayedColumnsWithTestNo.push(r.testLabel);

      if (!this.tablePreparedResults) {
        this.tablePreparedResults = {
          memory: [],
          performance: [],
        };
        for (let i = 0; i < r.memory.length; i++) {
          this.tablePreparedResults.memory.push({
            testNo: i,
          });
        }
        for (let j = 0; j < r.performance.length; j++) {
          this.tablePreparedResults.performance.push({
            testNo: j,
          });
        }
      }

      for (let i = 0; i < r.memory.length; i++) {
        this.tablePreparedResults.memory[i][r.testLabel] = r.memory[i];
      }
      for (let i = 0; i < r.performance.length; i++) {
        this.tablePreparedResults.performance[i][r.testLabel] = r.performance[i];
      }
    }
  }
}
