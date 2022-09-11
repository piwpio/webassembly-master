#include <emscripten.h>
#include <iostream>

extern "C" {


EMSCRIPTEN_KEEPALIVE
void cholesky(int n, double *matrix, int offset, double *lower)
{
    for (int i = 0; i < n; i++) {
        for (int j = 0; j <= i; j++) {
            int sum = 0;

            if (j == i) {
                for (int k = 0; k < j; k++) {
                    sum += lower[offset + j * n + k] * lower[offset + j * n + k];
                }
                lower[offset + j * n + j] = sqrt(matrix[j * n + j] - sum);
            } else {
                for (int k = 0; k < j; k++) {
                    sum += (lower[offset + i * n + k] * lower[offset + j * n + k]);
                }
                lower[offset + i * n + j] = (matrix[i * n + j] - sum) / lower[offset + j * n + j];
            }
        }
    }
}

EMSCRIPTEN_KEEPALIVE
void generateCholeskyMatrix(int n, double *matrix, int min, int max) {
    // generate base matrixes
    double array[n * n];
//     double *array = new double[n*n];
    for (int a = 0; a < n; a++) {
        for (int b = 0; b < n; b++) {
//             array[a * n + b] = std::floor(emscripten_random() * (max - min) + min);
            array[a * n + b] = emscripten_random() * (max - min) + min;
        }
    }

    // prepare results
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            for (int k = 0; k < n; k++) {
                matrix[i * n + j] += array[i * n + k] * array[j * n + k];
            }
        }
    }

//     delete [] array;
}

}
