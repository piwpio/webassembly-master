import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, OnDestroy,
  ViewChild
} from '@angular/core';
import { WebassemblyService } from '@services/webassembly.service';
import {
  ImageAllFunctions,
  ImageAllResults,
  ImageChartBlockResults,
  ImageFunction, ImageFunctions,
  ImageTablePreparedResults, ImageTestResults,
  ImageTests
} from '@features/image/image.model';
import { ChartBarsData } from '@models/charts.model';
import { jsGrayscale, jsInvert, jsSephia } from '@scripts/image/image';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { getAverage, getFastest, getMedian, getRowClass, getSlowest, round2 } from '@services/utils';

@Component({
  selector: 'image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasOriginal') canvasOriginal: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasJs') canvasJs: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasWasm') canvasWasm: ElementRef<HTMLCanvasElement>;

  isReady = false;
  isRunning = false;
  image: HTMLImageElement;
  getRowClass = getRowClass;

  imageTests = ImageTests;
  tableDisplayedColumns: string[] = ['testNo', ...ImageTests];
  tablePreparedResults: ImageTablePreparedResults[] = null;
  chartBlockResults: ImageChartBlockResults = null;
  chartBarsResults: ChartBarsData[] = null;
  allResults: ImageAllResults = null;
  private testSuites: ImageFunctions = {};
  private allTestSuites: ImageAllFunctions = {};

  private ctxOriginal: CanvasRenderingContext2D;
  private ctxJs: CanvasRenderingContext2D;
  private ctxWasm: CanvasRenderingContext2D;
  private wasmMemory: any;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private readonly webassemblyService: WebassemblyService, private readonly chRef: ChangeDetectorRef,
              private readonly matSnackBar: MatSnackBar) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {

    this.ctxOriginal = this.canvasOriginal.nativeElement.getContext('2d');
    this.ctxJs = this.canvasJs.nativeElement.getContext('2d');
    this.ctxWasm = this.canvasWasm.nativeElement.getContext('2d');

    this.allTestSuites.jsGrayscale = jsGrayscale;
    this.allTestSuites.jsInvert = jsInvert;
    this.allTestSuites.jsSephia = jsSephia;

    this.webassemblyService.initWasm('/assets/scripts/image/image.wasm').then((results) => {
      this.wasmMemory = results.instance.exports.memory;

      this.allTestSuites.wasmGrayscale = results.instance.exports._Z9grayscalePhi as ImageFunction;
      this.allTestSuites.wasmInvert = results.instance.exports._Z6invertPhi as ImageFunction;
      this.allTestSuites.wasmSephia = results.instance.exports._Z6sephiaPhi as ImageFunction;

      this.prepareImage();
    });
  }

  runTest(testsNo: number, testType: 'Grayscale' | 'Invert' | 'Sephia'): void {
    if (!this.areInputsValid(testType)) {
      this.matSnackBar.open('Invalid inputs');
      return;
    }

    this.tablePreparedResults = null;
    this.isRunning = true;
    this.chRef.markForCheck();

    setTimeout(() => {
      this.test2(testsNo, testType)
        .pipe(takeUntil(this.destroy$))
        .subscribe((results) => {
          this.isRunning = false;
          this.prepareResults(testsNo, results);
          this.chRef.markForCheck();
        });
    }, 500);
  }

  private test2(testsNo: number, testType: 'Grayscale' | 'Invert' | 'Sephia'): Observable<ImageTestResults> {
    return new Observable<ImageTestResults>((observer) => {
      this.testSuites = {
        js: this.allTestSuites[`js${testType}`],
        wasm: this.allTestSuites[`wasm${testType}`],
      }

      const results = {} as ImageTestResults;
      for (const test of ImageTests) {
        results[test] = [];
        const isWasm = test.indexOf('wasm') > -1;
        const testSuite = this.testSuites[test];

        for (let i = 0; i < testsNo; i++) {
          const imageData = this.ctxOriginal.getImageData(0, 0, this.canvasOriginal.nativeElement.width, this.canvasOriginal.nativeElement.height);
          let diff2 = 0;
          const startTime = performance.now();

          let array;
          if (isWasm) {
            const startTime2 = performance.now();
            array = new Uint8ClampedArray(this.wasmMemory.buffer, 0, imageData.data.length);
            array.set(imageData.data);
            const endTime2 = performance.now();
            diff2 = endTime2 - startTime2;
          } else {
            array = imageData.data;
            // array = new Uint8ClampedArray(imageData.data);
          }
          testSuite(!isWasm ? array : 0, array.length);
          imageData.data.set(array);
          const ctx = isWasm ? this.ctxWasm : this.ctxJs;
          this.prepareCanvas(ctx);
          ctx.putImageData(imageData, 0, 0);

          const endTime = performance.now();

          // let diff = endTime - startTime - diff2;
          let diff = endTime - startTime;
          if (diff === 0) diff = 0.000000000001;

          results[test].push(round2(diff));
        }

      }
      observer.next(results);
    });
  }

  private prepareImage(): void {
    this.isReady = false;
    const image = new Image();
    image.onload = () => {
      this.image = image;
      image.style.display = 'none';
      this.prepareCanvas(this.ctxOriginal);
      this.ctxOriginal.drawImage(image, 0, 0);
      this.isReady = true;
      this.chRef.markForCheck();
    };
    image.src = '/assets/images/niceView.jpeg';
  }

  private prepareCanvas(ctx: CanvasRenderingContext2D): void {
    ctx.canvas.width = this.image.width;
    ctx.canvas.height = this.image.height;
  }

  private prepareResults(testsNo: number, rawResults: ImageTestResults): void {
    this.chartBlockResults = {
      js: [
        { name: 'Best JS', value: getFastest(rawResults.js) },
        { name: 'Worst JS', value: getSlowest(rawResults.js) },
        { name: 'Average JS', value: getAverage(rawResults.js) },
        { name: 'Median JS', value: getMedian(rawResults.js) },
      ],
      wasm: [
        { name: 'Best WASM', value: getFastest(rawResults.wasm) },
        { name: 'Worst WASM', value: getSlowest(rawResults.wasm) },
        { name: 'Average WASM', value: getAverage(rawResults.wasm) },
        { name: 'Median WASM', value: getMedian(rawResults.wasm) },
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

  private areInputsValid(testType: 'Grayscale' | 'Invert' | 'Sephia'): boolean {
    return true;
  }
}
