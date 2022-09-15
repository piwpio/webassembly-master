#include <emscripten.h>
#include <iostream>

extern "C" {

EMSCRIPTEN_KEEPALIVE
void matrixMul(int n, double *matrix1, double *matrix2, double *matrixRes)
{
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            for (int k = 0; k < n; k++) {
                matrixRes[i * n + j] += matrix1[i * n + k] * matrix2[k * n + j];
            }
        }
    }
}


}
