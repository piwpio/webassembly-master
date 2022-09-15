#include <emscripten.h>
#include <iostream>

extern "C" {

int partition(double *arr, int start, int end)
{
    float pivot = arr[start];

    int count = 0;
    for (int i = start + 1; i <= end; i++) {
        if (arr[i] <= pivot) {
            count++;
        }
    }

    int pivotIndex = start + count;
    std::swap(arr[pivotIndex], arr[start]);

    int i = start, j = end;
    while (i < pivotIndex && j > pivotIndex) {
        while (arr[i] <= pivot) {
            i++;
        }
        while (arr[j] > pivot) {
            j--;
        }
        if (i < pivotIndex && j > pivotIndex) {
            std::swap(arr[i++], arr[j--]);
        }
    }

    return pivotIndex;
}

EMSCRIPTEN_KEEPALIVE
void quicksort(double data[], int start, int end)
{
    if (start >= end) return;

    int p = partition(data, start, end);
    quicksort(data, start, p - 1);
    quicksort(data, p + 1, end);
}

}
