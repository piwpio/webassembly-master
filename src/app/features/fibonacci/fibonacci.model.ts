import { ResultType } from '@models/common.model';
import { ChartCardData } from '@models/charts.model';

export type FibonacciFunction = (fib: number) => number;

export const FibonacciTests = ['jsRecursive', 'wasmRecursive'];

export interface FibonacciFunctions {
  jsRecursive?: FibonacciFunction;
  wasmRecursive?: FibonacciFunction;
}

export interface FibonacciTestResults {
  jsRecursive: ResultType[];
  wasmRecursive: ResultType[];
}

export interface FibonacciTablePreparedResults {
  testNo: number;
  jsRecursive: ResultType;
  wasmRecursive: ResultType;
}

export interface FibonacciChartBlockResults {
  jsRecursive: ChartCardData[];
  wasmRecursive: ChartCardData[];
}

export interface FibonacciAllResults {
  combined: ResultType[];
  jsRecursive: ResultType[];
  wasmRecursive: ResultType[];
}
