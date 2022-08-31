import { FibResults } from '@features/fibonacci/fibonacci.model';
import { ResultType } from '@models/common.model';

export const isFastestTime = (result: number, allResults: number[]): boolean => allResults.every((r) => result <= r);
export const isSlowestTime = (result: number, allResults: number[]): boolean => allResults.every((r) => result >= r);
export const getFastest = (results: number[]): number => results.sort((a, b) => a - b)?.[0] ?? undefined;
export const getSlowest = (results: number[]): number => results.sort((a, b) => b - a)?.[0] ?? undefined;
export const getAverage = (results: number[]): number => results.reduce((a, b) => a + b, 0) / results.length;
export const getMedian = (results: number[]): number => {
  results.sort((a, b) => a - b);
  const half = Math.floor(results.length / 2);
  if (results.length % 2) return results[half];
  return (results[half - 1] + results[half]) / 2.0;
};

export const quickSortPartition = (arr: number[], start: number, end: number): number => {
  // Taking the last element as the pivot
  const pivotValue = arr[end];
  let pivotIndex = start;
  for (let i = start; i < end; i++) {
    if (arr[i] < pivotValue) {
      // Swapping elements
      [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
      // Moving to next element
      pivotIndex++;
    }
  }

  // Putting the pivot value in the middle
  [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]];
  return pivotIndex;
};

export const getRowClass = (result: ResultType, allResults: ResultType[] ): 'cell--slowest' | 'cell--fastest' | '' => {
  if (isFastestTime(+result, allResults)) {
    return 'cell--fastest';
  } else if (isSlowestTime(+result, allResults)) {
    return 'cell--slowest';
  } else {
    return '';
  }
}
