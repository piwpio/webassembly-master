import { ResultType } from '../../models/common.model';
import { ChartCardData } from '../../models/charts.model';

export type ImageFunction = (data: Uint8ClampedArray, size: number) => void;

export const ImageTests = ['js', 'wasm'];

export interface ImageAllFunctions {
  jsGrayscale?: ImageFunction;
  jsInvert?: ImageFunction;
  jsSephia?: ImageFunction;
  wasmGrayscale?: ImageFunction;
  wasmInvert?: ImageFunction;
  wasmSephia?: ImageFunction;
}

export interface ImageFunctions {
  js?: ImageFunction;
  wasm?: ImageFunction;
}

export interface ImageTestResults {
  js: ResultType[];
  wasm: ResultType[];
}

export interface ImageTablePreparedResults {
  testNo: number;
  js: ResultType;
  wasm: ResultType;
}

export interface ImageChartBlockResults {
  js: ChartCardData[];
  wasm: ChartCardData[];
}

export interface ImageAllResults {
  combined: ResultType[];
  js: ResultType[];
  wasm: ResultType[];
}
