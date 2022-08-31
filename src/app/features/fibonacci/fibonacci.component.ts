import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { WebassemblyService } from '@services/webassembly.service';
import { Observable, Subject } from 'rxjs';
import { fibonacciRecursive } from '@scripts/fibonacci/fibonacci';
import {
  FibonacciFunction,
  FibonacciTestResults,
  FibonacciFunctions,
  FibonacciTablePreparedResults,
  FibonacciChartBlockResults,
  FibonacciTests,
  FibonacciAllResults,
} from '@features/fibonacci/fibonacci.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getAverage, getFastest, getMedian, getRowClass, getSlowest, round2 } from '@services/utils';
import { takeUntil } from 'rxjs/operators';
import { ChartBarsData } from '@models/charts.model';

@Component({
  selector: 'fibonacci',
  templateUrl: './fibonacci.component.html',
  styleUrls: ['./fibonacci.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FibonacciComponent implements OnInit, OnDestroy {
  isReady = false;
  isRunning = false;
  getRowClass = getRowClass;

  fibonacciTests = FibonacciTests;
  tableDisplayedColumns: string[] = ['testNo', ...FibonacciTests];
  tablePreparedResults: FibonacciTablePreparedResults[] = null;
  chartBlockResults: FibonacciChartBlockResults = null;
  chartBarsResults: ChartBarsData[] = null;
  allResults: FibonacciAllResults = null;
  private testSuites: FibonacciFunctions = {};

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
    this.testSuites.js = fibonacciRecursive;

    this.webassemblyService.initWasm('/assets/scripts/fibonacci/fibonacci.wasm').then((results) => {
      // this.testSuites.wasmWhile = results.instance.exports._Z14fibonacciWhilei as FibonacciFunction;
      this.testSuites.wasm = results.instance.exports._Z18fibonacciRecursivei as FibonacciFunction;

      this.warmup().subscribe(() => {
        this.isReady = true;
        this.chRef.markForCheck();
      });
    });
  }

  runTest(fibNumber: number, testsNo: number): void {
    if (!this.areInputsValid(fibNumber, testsNo)) {
      this.matSnackBar.open('Invalid inputs');
      return;
    }

    this.tablePreparedResults = null;
    this.isRunning = true;
    this.chRef.markForCheck();

    setTimeout(() => {
      this.test(fibNumber, testsNo)
        .pipe(takeUntil(this.destroy$))
        .subscribe((results) => {
          this.isRunning = false;
          this.prepareResults(testsNo, results);
          this.chRef.markForCheck();
        });
    }, 500);
  }

  private test(fibNumber: number, testsNo: number): Observable<FibonacciTestResults> {
    return new Observable<FibonacciTestResults>((observer) => {
      const results = {} as FibonacciTestResults;
      for (const test of FibonacciTests) {
        results[test] = [];
      }

      for (const type of FibonacciTests) {
        const testSuite = this.testSuites[type];

        for (let i = 0; i < testsNo; i++) {
          const startTime = performance.now();
          testSuite(fibNumber);
          const endTime = performance.now();

          let diff = endTime - startTime;
          if (diff === 0) diff = 0.000000000001;

          results[type].push(round2(diff));
        }
      }
      observer.next(results);
    });
  }

  private prepareResults(testsNo: number, rawResults: FibonacciTestResults): void {
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

    this.allResults = Object.assign(rawResults, { combined: [...rawResults.js, ...rawResults.wasm] });

    const tablePreparedResults = [];
    for (let i = 0; i < testsNo; i++) {
      tablePreparedResults.push({
        testNo: i,
        js: rawResults?.js?.[i] ?? -1,
        wasm: rawResults?.wasm?.[i] ?? -1,
      });
    }
    this.tablePreparedResults = tablePreparedResults;
  }

  private areInputsValid(fibNumber: number, testsNo: number): boolean {
    fibNumber ??= 0;
    testsNo ??= 0;
    return !(fibNumber < 0 || testsNo < 1);
  }

  private warmup(): Observable<FibonacciTestResults> {
    return this.test(3, 1);
  }
}
