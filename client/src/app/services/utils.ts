import { ResultType } from '@models/common.model';
export const isFastestTime = (result: number, allResults: number[]): boolean => allResults.every((r) => result <= r);
export const isSlowestTime = (result: number, allResults: number[]): boolean => allResults.every((r) => result >= r);
export const getFastest = (r: number[]): number => {
  const results = [...r];
  return results.sort((a, b) => a - b)?.[0] ?? undefined;
};
export const getSlowest = (r: number[]): number => {
  const results = [...r];
  return results.sort((a, b) => b - a)?.[0] ?? undefined;
};
export const getAverage = (results: number[]): number => results.reduce((a, b) => a + b, 0) / results.length;
export const getMedian = (r: number[]): number => {
  const results = [...r];
  results.sort((a, b) => a - b);
  const half = Math.floor(results.length / 2);
  if (results.length % 2) return results[half];
  return (results[half - 1] + results[half]) / 2.0;
};

export const round2 = (n: number): number => Math.round(n * 100) / 100;

export const getRowClass = (result: ResultType, allResults: ResultType[]): 'cell--slowest' | 'cell--fastest' | '' => {
  if (isFastestTime(+result, allResults)) {
    return 'cell--fastest';
  } else if (isSlowestTime(+result, allResults)) {
    return 'cell--slowest';
  } else {
    return '';
  }
};
