import * as math from 'mathjs';

export const jsSort = (data: number[], _start: number, _end: number): void => {
  data.sort((a, b) => a - b);
};

export const jsSortMath = (data: number[], _start: number, _end: number): void => {
  math.sort(data, (a, b) => a - b);
};

export const jsQuickSort = (data: number[], start: number, end: number): void => {
  if (start >= end) return;
  const p = quickSortPartition(data, start, end);
  jsQuickSort(data, start, p - 1);
  jsQuickSort(data, p + 1, end);
};

const quickSortPartition = (arr: number[], start: number, end: number): number => {
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
