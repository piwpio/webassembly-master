import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { WebassemblyService } from '@services/webassembly.service';
import { Observable, Subject } from 'rxjs';
import { fibonacci as fibonacciJS } from '@scripts/fibonacci/fibonacci';
import { Fib, FibResult, FibResults, FibTests } from '@features/fibonacci/fibonacci.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'fibonacci',
  templateUrl: './fibonacci.component.html',
  styleUrls: ['./fibonacci.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FibonacciComponent implements OnInit, OnDestroy {
  isReady = false;
  isRunning = false;
  testSuites: FibTests = {};
  tableDisplayedColumns: string[] = ['testNo', 'js', 'wasm'];
  tablePreparedResults: { testNo: number; js: FibResult | '-'; wasm: FibResult | '-' }[] = [];

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly webassemblyService: WebassemblyService,
    private readonly chRef: ChangeDetectorRef,
    private readonly matSnackBar: MatSnackBar
  ) {}

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

    this.tablePreparedResults = [];
    this.isRunning = true;
    this.chRef.markForCheck();

    setTimeout(() => {
      this.test(fibNumber, testsNo).subscribe((results) => {
        this.isRunning = false;
        this.prepareResults(testsNo, results);
        this.chRef.markForCheck();
      });
    }, 500);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
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

    this.tablePreparedResults = tpr;
  }

  private areInputsValid(fibNumber: number, testsNo: number): boolean {
    fibNumber ??= 0;
    testsNo ??= 0;
    return !(fibNumber < 0 || testsNo < 1);
  }

  private warmup(): Observable<FibResults> {
    return this.test(1, 1);
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
