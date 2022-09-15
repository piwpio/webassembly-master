const quicksort = (data, start, end) => {
  if (start >= end) return;
  const p = partition(data, start, end);
  quicksort(data, start, p - 1);
  quicksort(data, p + 1, end);
}

function partition(arr, start, end) {
  let pivot = arr[start];

  let count = 0;
  for (let i = start + 1; i <= end; i++) {
    if (arr[i] <= pivot) {
      count++;
    }
  }

  let pivotIndex = start + count;
  [arr[start], arr[pivotIndex]] = [arr[pivotIndex], arr[start]];

  let i = start, j = end;
  while (i < pivotIndex && j > pivotIndex) {
    while (arr[i] <= pivot) {
      i++;
    }
    while (arr[j] > pivot) {
      j--;
    }
    if (i < pivotIndex && j > pivotIndex) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++; j--;
    }
  }

  return pivotIndex;
}

exports.quicksort = quicksort;
