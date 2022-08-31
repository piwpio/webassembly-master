import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { WebassemblyService } from '@services/webassembly.service';
import { Observable, Subject } from 'rxjs';
import { jsFibonacciRecursive, jsFibonacciWhile } from '@scripts/fibonacci/fibonacci';
import {
  FibonacciFunction,
  FibonacciTestResults,
  FibonacciAllFunctions,
  FibonacciTablePreparedResults,
  FibonacciChartBlockResults,
  FibonacciTests,
  FibonacciAllResults, FibonacciFunctions,
} from '@features/fibonacci/fibonacci.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getAverage, getFastest, getMedian, getRowClass, getSlowest, round2 } from '@services/utils';
import { takeUntil } from 'rxjs/operators';
import { ChartBarsData } from '@models/charts.model';
import { CalculationResults } from '@models/common.model';

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
  results: CalculationResults = null;
  private testSuites: FibonacciFunctions = {};
  private allTestSuites: FibonacciAllFunctions = {};

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
    this.allTestSuites.jsRecursive = jsFibonacciRecursive;
    this.allTestSuites.jsWhile = jsFibonacciWhile;

    this.webassemblyService.initWasm('/assets/scripts/fibonacci/fibonacci.wasm').then((results) => {
      console.log(results.instance.exports);
      this.allTestSuites.wasmWhile = results.instance.exports._Z14fibonacciWhilei as FibonacciFunction;
      this.allTestSuites.wasmRecursive = results.instance.exports._Z18fibonacciRecursivei as FibonacciFunction;

      this.warmup().subscribe(() => {
        this.isReady = true;
        this.chRef.markForCheck();
      });
    });
  }

  runTest(fibNumber: number, testsNo: number, isRecursive = false): void {
    if (!this.areInputsValid(fibNumber, testsNo, isRecursive)) {
      this.matSnackBar.open('Invalid inputs');
      return;
    }

    this.tablePreparedResults = null;
    this.isRunning = true;
    this.chRef.markForCheck();

    setTimeout(() => {
      this.test(fibNumber, testsNo, isRecursive)
        .pipe(takeUntil(this.destroy$))
        .subscribe((results) => {
          this.isRunning = false;
          this.prepareResults(testsNo, results);
          this.chRef.markForCheck();
        });
    }, 500);
  }

  private test(fibNumber: number, testsNo: number, isRecursive: boolean): Observable<FibonacciTestResults> {
    return new Observable<FibonacciTestResults>((observer) => {
      this.testSuites = {
        js: isRecursive ? this.allTestSuites.jsRecursive : this.allTestSuites.jsWhile,
        wasm: isRecursive ? this.allTestSuites.wasmRecursive : this.allTestSuites.wasmWhile,
      }

      this.results = {
        js: 0,
        wasm: 0,
      };

      const results = {} as FibonacciTestResults;
      for (const test of FibonacciTests) {
        results[test] = [];
        const testSuite = this.testSuites[test];
        for (let i = 0; i < testsNo; i++) {
          const startTime = performance.now();
          const res = testSuite(fibNumber);
          const endTime = performance.now();

          let diff = endTime - startTime;
          if (diff === 0) diff = 0.000000000001;

          this.results[test] = res;
          results[test].push(isRecursive ? round2(diff) : diff);
        }
      }
      observer.next(results);
    });
  }

  private prepareResults(testsNo: number, rawResults: FibonacciTestResults): void {
    this.chartBlockResults = {
      js: [
        { name: 'Best JS recursive', value: getFastest(rawResults.js) },
        { name: 'Worst JS recursive', value: getSlowest(rawResults.js) },
        { name: 'Average JS recursive', value: getAverage(rawResults.js) },
        { name: 'Median JS recursive', value: getMedian(rawResults.js) },
      ],
      wasm: [
        { name: 'Best WASM while', value: getFastest(rawResults.wasm) },
        { name: 'Worst WASM while', value: getSlowest(rawResults.wasm) },
        { name: 'Average WASM while', value: getAverage(rawResults.wasm) },
        { name: 'Median WASM while', value: getMedian(rawResults.wasm) },
      ],
    };
    this.chartBarsResults = [
      {
        name: 'Best',
        series: [
          { name: 'JS', value: this.chartBlockResults.js[0].value },
          { name: 'WASM', value: this.chartBlockResults.wasm[0].value },
        ],
      },
      {
        name: 'Worst',
        series: [
          { name: 'JS', value: this.chartBlockResults.js[1].value },
          { name: 'WASM', value: this.chartBlockResults.wasm[1].value },
        ],
      },
      {
        name: 'Average',
        series: [
          { name: 'JS', value: this.chartBlockResults.js[2].value },
          { name: 'WASM', value: this.chartBlockResults.wasm[2].value },
        ],
      },
      {
        name: 'Median',
        series: [
          { name: 'JS', value: this.chartBlockResults.js[3].value },
          { name: 'WASM', value: this.chartBlockResults.wasm[3].value },
        ],
      },
    ];

    this.allResults = Object.assign(rawResults, { combined: [...rawResults.js,...rawResults.wasm ] });

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

  private areInputsValid(fibNumber: number, testsNo: number, isRecursive: boolean): boolean {
    fibNumber ??= 0;
    testsNo ??= 0;
    return !(isRecursive === undefined || fibNumber < 0 || testsNo < 1 || (isRecursive && fibNumber > 40));
  }

  private warmup(): Observable<FibonacciTestResults> {
    return this.test(3, 1, false);
  }
}
