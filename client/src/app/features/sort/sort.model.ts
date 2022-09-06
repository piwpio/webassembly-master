import { ChartCardData } from '../../models/charts.model';
import { ResultType } from '../../models/common.model';

export type SortFunction = (data: number[], start: number, end: number) => void;

export const SortTests = ['js', 'jsMath', 'jsQs', 'wasmQs', 'wasmStd'];

export interface SortFunctions {
  js?: SortFunction;
  jsMath?: SortFunction;
  jsQs?: SortFunction;
  wasmQs?: SortFunction;
  wasmStd?: SortFunction;
}

export interface SortTestResults {
  js: ResultType[];
  jsMath: ResultType[];
  jsQs: ResultType[];
  wasmQs: ResultType[];
  wasmStd: ResultType[];
}

export interface SortTablePreparedResults {
  testNo: number;
  js: ResultType;
  jsMath: ResultType;
  jsQs: ResultType;
  wasmQs: ResultType;
  wasmStd: ResultType;
}

export interface SortChartBlockResults {
  js: ChartCardData[];
  jsMath: ChartCardData[];
  jsQs: ChartCardData[];
  wasmQs: ChartCardData[];
  wasmStd: ChartCardData[];
}

export interface SortAllResults {
  combined: ResultType[];
  js: ResultType[];
  jsMath: ResultType[];
  jsQs: ResultType[];
  wasmQs: ResultType[];
  wasmStd: ResultType[];
}
