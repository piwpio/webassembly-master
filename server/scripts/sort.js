const math = require('mathjs')

const jsSort = (data, _start, _end)  => {
  data.sort((a, b) => a - b);
}
const jsSortMath = (data, _start, _end)  => {
  math.sort(data, (a, b) => a - b);
}
const jsQuickSort = (data, start, end) => {
  if (start >= end) return;
  const p = quickSortPartition(data, start, end);
  jsQuickSort(data, start, p - 1);
  jsQuickSort(data, p + 1, end);
}

function quickSortPartition(arr , start, end) {
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
}

exports.jsSort = jsSort;
exports.jsSortMath = jsSortMath
exports.jsQuickSort = jsQuickSort;
