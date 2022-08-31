import { ResultType } from '@models/common.model';
import { ChartCardData } from '@models/charts.model';

export type FibonacciFunction = (fib: number) => number;

export type FibResult = DOMHighResTimeStamp;

export const FibonacciTests = ['js', 'wasm'];

export interface FibonacciFunctions {
  js?: FibonacciFunction;
  wasm?: FibonacciFunction;
}

export interface FibonacciTestResults {
  js: ResultType[];
  wasm: ResultType[];
}

export interface FibonacciTablePreparedResults {
  testNo: number;
  js: ResultType;
  wasm: ResultType;
}

export interface FibonacciChartBlockResults {
  js: ChartCardData[];
  wasm: ChartCardData[];
}

export interface FibonacciAllResults {
  combined: ResultType[];
  js: ResultType[];
  wasm: ResultType[];
}
