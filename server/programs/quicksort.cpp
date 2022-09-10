#include <emscripten.h>
#include <iostream>

extern "C" {

int partition(float arr[], int start, int end)
{
    float pivot = arr[start];

    int count = 0;
    for (int i = start + 1; i <= end; i++) {
        if (arr[i] <= pivot)
            count++;
    }

    // Giving pivot element its correct position
    int pivotIndex = start + count;
    std::swap(arr[pivotIndex], arr[start]);

    // Sorting left and right parts of the pivot element
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
void quickSort(float data[], int start, int end)
{
    // base case
    if (start >= end)
        return;

    // partitioning the array
    int p = partition(data, start, end);

    // Sorting the left part
    quickSort(data, start, p - 1);

    // Sorting the right part
    quickSort(data, p + 1, end);
}

}
