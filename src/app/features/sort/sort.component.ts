import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { WebassemblyService } from '@services/webassembly.service';
import {
  SortFunction,
  SortChartBlockResults,
  SortTablePreparedResults,
  SortFunctions,
  SortTests,
  SortTestResults,
  SortAllResults,
} from '@features/sort/sort.model';
import { getAverage, getFastest, getMedian, getRowClass, getSlowest, round2 } from '@services/utils';
import { takeUntil } from 'rxjs/operators';
import { ChartBarsData } from '@models/charts.model';
import { Observable, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { jsQuickSort, jsSort, jsSortMath } from '@scripts/sort/sort';

@Component({
  selector: 'sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortComponent implements OnInit, OnDestroy {
  isReady = false;
  isRunning = false;
  getRowClass = getRowClass;

  sortTests = SortTests;
  tableDisplayedColumns: string[] = ['testNo', ...SortTests];
  tablePreparedResults: SortTablePreparedResults[] = null;
  chartBlockResults: SortChartBlockResults = null;
  chartBarsResults: ChartBarsData[] = null;
  allResults: SortAllResults = null;
  private testSuites: SortFunctions = {};

  private feed: number[] = null;
  private wasmMemory: any;
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
    this.testSuites.js = jsSort;
    this.testSuites.jsQs = jsQuickSort;
    this.testSuites.jsMath = jsSortMath;

    this.webassemblyService.initWasm('/assets/scripts/sort/sort.wasm').then((results) => {
      this.wasmMemory = results.instance.exports.memory;
      this.testSuites.wasmQs = results.instance.exports._Z9quickSortPfii as SortFunction;
      this.testSuites.wasmStd = results.instance.exports._Z4sortPfii as SortFunction;

      this.warmup().subscribe(() => {
        this.isReady = true;
        this.chRef.markForCheck();
      });
    });
  }

  runTest(testsNo: number, arraySize: number, floats: boolean): void {
    if (!this.areInputsValid(testsNo, arraySize, floats)) {
      this.matSnackBar.open('Invalid inputs');
      return;
    }

    this.tablePreparedResults = null;
    this.isRunning = true;
    this.chRef.markForCheck();

    setTimeout(() => {
      this.test(testsNo, arraySize, floats)
        .pipe(takeUntil(this.destroy$))
        .subscribe((results) => {
          this.isRunning = false;
          this.prepareResults(testsNo, results);
          this.chRef.markForCheck();
        });
    }, 500);
  }

  private test(testsNo, arraySize, floats): Observable<SortTestResults> {
    return new Observable<SortTestResults>((observer) => {
      const results = {} as SortTestResults;
      for (const test of SortTests) {
        results[test] = [];
      }

      for (const test of SortTests) {
        const testSuite = this.testSuites[test];
        const isWasm = test.indexOf('wasm') > -1;

        for (let i = 0; i < testsNo; i++) {
          // Specific code
          this.generateFeed(arraySize, floats); //max 30_000_000
          let startTime2;
          let endTime2;
          let diff2 = 0;

          const startTime = performance.now();
          let array;
          if (isWasm) {
            startTime2 = performance.now();
            array = new Float32Array(this.wasmMemory.buffer, 0, this.feed.length);
            array.set(this.feed);
            endTime2 = performance.now();
            diff2 = endTime2 - startTime2;
          } else {
            array = this.feed;
          }
          testSuite(!isWasm ? array : array.byteOffset, 0, array.length - 1);
          // Specific code

          const endTime = performance.now();
          let diff = endTime - startTime - diff2;
          if (diff === 0) diff = 0.000000000001;

          results[test].push(round2(diff));
        }
      }
      observer.next(results);
    });
  }

  private generateFeed(arraySize: number, floats = true, max = 200_000_000): void {
    this.feed = [];
    if (floats) {
      for (let i = 0; i < arraySize; i++) {
        this.feed.push(Math.random());
      }
    } else {
      for (let i = 0; i < arraySize; i++) {
        this.feed.push(Math.floor(Math.random() * max));
      }
    }
  }

  private prepareResults(testsNo: number, rawResults: SortTestResults): void {
    this.chartBlockResults = {
      js: [
        { name: 'Best JS Native', value: getFastest(rawResults.js) },
        { name: 'Worst JS Native', value: getSlowest(rawResults.js) },
        { name: 'Average JS Native', value: getAverage(rawResults.js) },
        { name: 'Median JS Native', value: getMedian(rawResults.js) },
      ],
      jsMath: [
        { name: 'Best JS Math.js', value: getFastest(rawResults.jsMath) },
        { name: 'Worst JS Math.js', value: getSlowest(rawResults.jsMath) },
        { name: 'Average JS Math.js', value: getAverage(rawResults.jsMath) },
        { name: 'Median JS Math.js', value: getMedian(rawResults.jsMath) },
      ],
      jsQs: [
        { name: 'Best JS QuickSort', value: getFastest(rawResults.jsQs) },
        { name: 'Worst JS QuickSort', value: getSlowest(rawResults.jsQs) },
        { name: 'Average JS QuickSort', value: getAverage(rawResults.jsQs) },
        { name: 'Median JS QuickSort', value: getMedian(rawResults.jsQs) },
      ],
      wasmQs: [
        { name: 'Best WASM QuickSort', value: getFastest(rawResults.wasmQs) },
        { name: 'Worst WASM QuickSort', value: getSlowest(rawResults.wasmQs) },
        { name: 'Average WASM QuickSort', value: getAverage(rawResults.wasmQs) },
        { name: 'Median WASM QuickSort', value: getMedian(rawResults.wasmQs) },
      ],
      wasmStd: [
        { name: 'Best WASM std::sort', value: getFastest(rawResults.wasmStd) },
        { name: 'Worst WASM std::sort', value: getSlowest(rawResults.wasmStd) },
        { name: 'Average WASM std::sort', value: getAverage(rawResults.wasmStd) },
        { name: 'Median WASM std::sort', value: getMedian(rawResults.wasmStd) },
      ],
    };

    this.chartBarsResults = [
      {
        name: 'Best',
        series: [
          { name: 'JS Native', value: this.chartBlockResults.js[0].value },
          { name: 'JS Math.js', value: this.chartBlockResults.jsMath[0].value },
          { name: 'JS QuickSort', value: this.chartBlockResults.jsQs[0].value },
          { name: 'WASM QuickSort', value: this.chartBlockResults.wasmQs[0].value },
          { name: 'WASM std::sort', value: this.chartBlockResults.wasmStd[0].value },
        ],
      },
      {
        name: 'Worst',
        series: [
          { name: 'JS Native', value: this.chartBlockResults.js[1].value },
          { name: 'JS Math.js', value: this.chartBlockResults.jsMath[1].value },
          { name: 'JS QuickSort', value: this.chartBlockResults.jsQs[1].value },
          { name: 'WASM QuickSort', value: this.chartBlockResults.wasmQs[1].value },
          { name: 'WASM std::sort', value: this.chartBlockResults.wasmStd[1].value },
        ],
      },
      {
        name: 'Average',
        series: [
          { name: 'JS Native', value: this.chartBlockResults.js[2].value },
          { name: 'JS Math.js', value: this.chartBlockResults.jsMath[2].value },
          { name: 'JS QuickSort', value: this.chartBlockResults.jsQs[2].value },
          { name: 'WASM QuickSort', value: this.chartBlockResults.wasmQs[2].value },
          { name: 'WASM std::sort', value: this.chartBlockResults.wasmStd[2].value },
        ],
      },
      {
        name: 'Median',
        series: [
          { name: 'JS Native', value: this.chartBlockResults.js[3].value },
          { name: 'JS Math.js', value: this.chartBlockResults.jsMath[3].value },
          { name: 'JS QuickSort', value: this.chartBlockResults.jsQs[3].value },
          { name: 'WASM QuickSort', value: this.chartBlockResults.wasmQs[3].value },
          { name: 'WASM std::sort', value: this.chartBlockResults.wasmStd[3].value },
        ],
      },
    ];

    this.allResults = Object.assign(rawResults, {
      combined: [
        ...rawResults.js,
        ...rawResults.jsMath,
        ...rawResults.jsQs,
        ...rawResults.wasmQs,
        ...rawResults.wasmStd,
      ],
    });

    const tablePreparedResults = [];
    for (let i = 0; i < testsNo; i++) {
      tablePreparedResults.push({
        testNo: i,
        js: rawResults?.js?.[i] ?? -1,
        jsMath: rawResults?.jsMath?.[i] ?? -1,
        jsQs: rawResults?.jsQs?.[i] ?? -1,
        wasmQs: rawResults?.wasmQs?.[i] ?? -1,
        wasmStd: rawResults?.wasmStd?.[i] ?? -1,
      });
    }
    this.tablePreparedResults = tablePreparedResults;
  }

  private areInputsValid(testsNo: number, arraySize: number, floats: boolean): boolean {
    testsNo ??= 0;
    arraySize ??= 0;
    return !(floats === undefined || testsNo < 1 || arraySize < 1 || arraySize > 30000000);
  }

  private warmup(): Observable<SortTestResults> {
    return this.test(1, 10, true);
  }
}
