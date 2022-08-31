import { ResultType } from '@models/common.model';
import { ChartCardData } from '@models/charts.model';

export type FibonacciFunction = (fib: number) => number;

export const FibonacciTests = ['jsRecursive', 'jsWhile', 'wasmRecursive', 'wasmWhile'];

export interface FibonacciFunctions {
  jsRecursive?: FibonacciFunction;
  jsWhile?: FibonacciFunction;
  wasmRecursive?: FibonacciFunction;
  wasmWhile?: FibonacciFunction;
}

export interface FibonacciTestResults {
  jsRecursive: ResultType[];
  jsWhile: ResultType[];
  wasmRecursive: ResultType[];
  wasmWhile: ResultType[];
}

export interface FibonacciTablePreparedResults {
  testNo: number;
  jsRecursive: ResultType;
  jsWhile: ResultType;
  wasmWhile: ResultType;
}

export interface FibonacciChartBlockResults {
  jsRecursive: ChartCardData[];
  jsWhile: ChartCardData[];
  wasmRecursive: ChartCardData[];
  wasmWhile: ChartCardData[];
}

export interface FibonacciAllResults {
  combined: ResultType[];
  jsRecursive: ResultType[];
  jsWhile: ResultType[];
  wasmRecursive: ResultType[];
  wasmWhile: ResultType[];
}
