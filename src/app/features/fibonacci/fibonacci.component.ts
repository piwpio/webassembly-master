import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { WebassemblyService } from '@services/webassembly.service';
import { Observable, Subject } from 'rxjs';
import { jsFibonacciRecursive, jsFibonacciWhile } from '@scripts/fibonacci/fibonacci';
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
    this.testSuites.jsRecursive = jsFibonacciRecursive;
    this.testSuites.jsWhile = jsFibonacciWhile;

    this.webassemblyService.initWasm('/assets/scripts/fibonacci/fibonacci.wasm').then((results) => {
      this.testSuites.wasmWhile = results.instance.exports._Z14fibonacciWhilei as FibonacciFunction;
      this.testSuites.wasmRecursive = results.instance.exports._Z18fibonacciRecursivei as FibonacciFunction;

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
        console.log(type);
        for (let i = 0; i < testsNo; i++) {
          const startTime = performance.now();
          // console.log(fibNumber)
          const a = testSuite(fibNumber);
          console.log(a);
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
    console.log(rawResults);
    this.chartBlockResults = {
      jsRecursive: [
        { name: 'Best JS recursive', value: getFastest(rawResults.jsRecursive) },
        { name: 'Worst JS recursive', value: getSlowest(rawResults.jsRecursive) },
        { name: 'Average JS recursive', value: getAverage(rawResults.jsRecursive) },
        { name: 'Median JS recursive', value: getMedian(rawResults.jsRecursive) },
      ],
      jsWhile: [
        { name: 'Best JS while', value: getFastest(rawResults.jsWhile) },
        { name: 'Best JS while', value: getSlowest(rawResults.jsWhile) },
        { name: 'Best JS while', value: getAverage(rawResults.jsWhile) },
        { name: 'Best JS while', value: getMedian(rawResults.jsWhile) },
      ],
      wasmRecursive: [
        { name: 'Best WASM recursive', value: getFastest(rawResults.wasmRecursive) },
        { name: 'Worst WASM recursive', value: getSlowest(rawResults.wasmRecursive) },
        { name: 'Average WASM recursive', value: getAverage(rawResults.wasmRecursive) },
        { name: 'Median WASM recursive', value: getMedian(rawResults.wasmRecursive) },
      ],
      wasmWhile: [
        { name: 'Best WASM while', value: getFastest(rawResults.wasmWhile) },
        { name: 'Worst WASM while', value: getSlowest(rawResults.wasmWhile) },
        { name: 'Average WASM while', value: getAverage(rawResults.wasmWhile) },
        { name: 'Median WASM while', value: getMedian(rawResults.wasmWhile) },
      ],
    };
    this.chartBarsResults = [
      {
        name: 'Best',
        series: [
          { name: 'JS recursive', value: this.chartBlockResults.jsRecursive[0].value },
          { name: 'JS while', value: this.chartBlockResults.jsWhile[0].value },
          { name: 'WASM recursive', value: this.chartBlockResults.wasmRecursive[0].value },
          { name: 'WASM while', value: this.chartBlockResults.wasmWhile[0].value },
        ],
      },
      {
        name: 'Worst',
        series: [
          { name: 'JS recursive', value: this.chartBlockResults.jsRecursive[1].value },
          { name: 'JS while', value: this.chartBlockResults.jsWhile[1].value },
          { name: 'WASM recursive', value: this.chartBlockResults.wasmRecursive[1].value },
          { name: 'WASM while', value: this.chartBlockResults.wasmWhile[1].value },
        ],
      },
      {
        name: 'Average',
        series: [
          { name: 'JS recursive', value: this.chartBlockResults.jsRecursive[2].value },
          { name: 'JS while', value: this.chartBlockResults.jsWhile[2].value },
          { name: 'WASM recursive', value: this.chartBlockResults.wasmRecursive[2].value },
          { name: 'WASM while', value: this.chartBlockResults.wasmWhile[2].value },
        ],
      },
      {
        name: 'Median',
        series: [
          { name: 'JS recursive', value: this.chartBlockResults.jsRecursive[3].value },
          { name: 'JS while', value: this.chartBlockResults.jsWhile[3].value },
          { name: 'WASM recursive', value: this.chartBlockResults.wasmRecursive[3].value },
          { name: 'WASM while', value: this.chartBlockResults.wasmWhile[3].value },
        ],
      },
    ];

    this.allResults = Object.assign(rawResults, { combined: [...rawResults.jsRecursive,...rawResults.jsWhile, ...rawResults.wasmRecursive, ...rawResults.wasmWhile] });

    const tablePreparedResults = [];
    for (let i = 0; i < testsNo; i++) {
      tablePreparedResults.push({
        testNo: i,
        jsRecursive: rawResults?.jsRecursive?.[i] ?? -1,
        jsWhile: rawResults?.jsWhile?.[i] ?? -1,
        wasmRecursive: rawResults?.wasmRecursive?.[i] ?? -1,
        wasmWhile: rawResults?.wasmWhile?.[i] ?? -1,
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
