import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { WebassemblyService } from '@services/webassembly.service';
import { Observable, Subject } from 'rxjs';
import { fibonacci as fibonacciJS } from '@scripts/fibonacci/fibonacci';
import { Fib, FibResult, FibResults, FibTests } from '@features/fibonacci/fibonacci.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isFastestTime, isSlowestTime } from '@services/utils';
import { takeUntil } from 'rxjs/operators';

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

  private testSuites: FibTests = {};
  private allResults: {
    all: FibResult[];
    allJs: FibResult[];
    allWasm: FibResult[];
  } = null;
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
    this.testSuites['js'] = {
      testLabel: 'JavaScript method',
      method: fibonacciJS as Fib,
    };

    this.webassemblyService.initWasm('/assets/scripts/fibonacci/fibonacci.wasm').then((results) => {
      this.testSuites['wasm'] = {
        testLabel: 'WebAssembly method',
        method: results.instance.exports.fibonacci as Fib,
      };

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
    if (isFastestTime(+results, this.allResults.all)) {
      return 'cell--fastest';
    } else if (isSlowestTime(+results, this.allResults.all)) {
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

    this.allResults = {
      all: [...rawResults.js, ...rawResults.wasm],
      allJs: rawResults.js,
      allWasm: rawResults.wasm,
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
          testSuite.method(fibNumber);
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
