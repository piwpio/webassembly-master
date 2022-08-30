import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { WebassemblyService } from '@services/webassembly.service';
import { Observable, Subject } from 'rxjs';
import { fibonacci as fibonacciJS } from '@scripts/fibonacci/fibonacci';
import { Fib, FibResult, FibResults, FibTests } from '@features/fibonacci/fibonacci.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getAverage, getFastest, getMedian, getSlowest, isFastestTime, isSlowestTime } from '@services/utils';
import { takeUntil } from 'rxjs/operators';
import { ChartBarsData, ChartCardData } from '@models/charts.model';

@Component({
  selector: 'fibonacci',
  templateUrl: './fibonacci.component.html',
  styleUrls: ['./fibonacci.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FibonacciComponent implements OnInit, OnDestroy {
  isReady = false;
  isRunning = false;
  tableDisplayedColumns: string[] = ['testNo', 'js', 'wasm'];
  tablePreparedResults: { testNo: number; js: FibResult | '-'; wasm: FibResult | '-' }[] = null;
  chartBlockResults: { [k in 'js' | 'wasm']: ChartCardData[] } = null;
  chartBarsResults: ChartBarsData[] = null;

  private testSuites: FibTests = {};
  private allResults: { [k in 'combined' | 'js' | 'wasm']: FibResult[] } = null;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly webassemblyService: WebassemblyService,
    private readonly chRef: ChangeDetectorRef,
    private readonly matSnackBar: MatSnackBar
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.testSuites['js'] = fibonacciJS as Fib;

    this.webassemblyService.initWasm('/assets/scripts/fibonacci/fibonacci.wasm').then((results) => {
      this.testSuites['wasm'] = results.instance.exports.fibonacci as Fib;

      this.warmup().subscribe(() => {
        this.isReady = true;
        this.chRef.markForCheck();
      });
    });
  }

  runTest(fibNumber: number, testsNo: number) {
    if (!this.areInputsValid(fibNumber, testsNo)) {
      this.matSnackBar.open('Invalid inputs');
      return;
    }

    this.tablePreparedResults = null;
    this.isRunning = true;
    this.chRef.markForCheck();

    setTimeout(() => {
      this.test(fibNumber, testsNo)
        .pipe(
          takeUntil(this.destroy$)
          // delay(500)
        )
        .subscribe((results) => {
          this.isRunning = false;
          this.prepareResults(testsNo, results);
          this.chRef.markForCheck();
        });
    }, 500);
  }

  getRowClass(results: FibResults): 'cell--slowest' | 'cell--fastest' | '' {
    if (isFastestTime(+results, this.allResults.combined)) {
      return 'cell--fastest';
    } else if (isSlowestTime(+results, this.allResults.combined)) {
      return 'cell--slowest';
    } else {
      return '';
    }
  }

  private prepareResults(testsNo: number, rawResults: FibResults): void {
    const tpr = [];
    for (let i = 0; i < testsNo; i++) {
      tpr.push({
        testNo: i,
        js: rawResults?.js?.[i] ?? '-',
        wasm: rawResults?.wasm?.[i] ?? '-',
      });
    }

    this.chartBlockResults = {
      js: [
        { name: 'Best JavaScript', value: getFastest(rawResults.js) },
        { name: 'Worst JavaScript', value: getSlowest(rawResults.js) },
        { name: 'Average JavaScript', value: getAverage(rawResults.js) },
        { name: 'Median JavaScript', value: getMedian(rawResults.js) },
      ],
      wasm: [
        { name: 'Best WebAssembly', value: getFastest(rawResults.wasm) },
        { name: 'Worst WebAssembly', value: getSlowest(rawResults.wasm) },
        { name: 'Average WebAssembly', value: getAverage(rawResults.wasm) },
        { name: 'Median WebAssembly', value: getMedian(rawResults.wasm) },
      ],
    };
    this.chartBarsResults = [
      {
        name: 'Best',
        series: [
          { name: 'JavaScript', value: this.chartBlockResults.js[0].value },
          { name: 'WebAssembly', value: this.chartBlockResults.wasm[0].value },
        ],
      },
      {
        name: 'Worst',
        series: [
          { name: 'JavaScript', value: this.chartBlockResults.js[1].value },
          { name: 'WebAssembly', value: this.chartBlockResults.wasm[1].value },
        ],
      },
      {
        name: 'Average',
        series: [
          { name: 'JavaScript', value: this.chartBlockResults.js[2].value },
          { name: 'WebAssembly', value: this.chartBlockResults.wasm[2].value },
        ],
      },
      {
        name: 'Median',
        series: [
          { name: 'JavaScript', value: this.chartBlockResults.js[3].value },
          { name: 'WebAssembly', value: this.chartBlockResults.wasm[3].value },
        ],
      },
    ];
    this.allResults = {
      combined: [...rawResults.js, ...rawResults.wasm],
      js: rawResults.js,
      wasm: rawResults.wasm,
    };
    this.tablePreparedResults = tpr;
  }

  private areInputsValid(fibNumber: number, testsNo: number): boolean {
    fibNumber ??= 0;
    testsNo ??= 0;
    return !(fibNumber < 0 || testsNo < 1);
  }

  private warmup(): Observable<FibResults> {
    return this.test(3, 1);
  }

  private test(fibNumber: number, testsNo: number): Observable<FibResults> {
    return new Observable<FibResults>((observer) => {
      const results = { js: [], wasm: [] };

      for (const type of ['js', 'wasm']) {
        const testSuite = this.testSuites[type];

        for (let i = 0; i < testsNo; i++) {
          const startTime = performance.now();
          testSuite(fibNumber);
          const endTime = performance.now();

          let diff = endTime - startTime;
          if (diff === 0) diff = 0.000000000001;

          results[type].push(diff);
        }
      }
      observer.next(results);
    });
  }
}
