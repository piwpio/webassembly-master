#include <emscripten.h>
#include <iostream>

extern "C" {

EMSCRIPTEN_KEEPALIVE
double matrixDet(int n, double *matrix)
{
//     double tmp;
    double det = 1;
    for (int k = 0; k < n - 1; k++) {
        for (int i = k; i < n - 1;) {
            // if diagonal number equals 0 swap it with other row
//             if (matrix[k * n + k] == 0) {
//                 int swapIndex = 0;
//                 for (int l = i+1; l < n; l++) {
//                     if (matrix[l * n + k] != 0) {
//                         swapIndex = l;
//                         break;
//                     }
//                 }
//
//                 // check if there is row without 0. If not this column is already done;
//                 if (swapIndex == 0) {
//                     i++;
//                     continue;
//                 }
//
//                 // swap rows
//                 for (int q = 0; q < n; q++) {
//                     tmp = matrix[k * n + q];
//                     matrix[k * n + q] = matrix[swapIndex * n + q];
//                     matrix[swapIndex * n + q] = tmp;
//                 }
//                 continue;
//             }

            double c = matrix[(i+1) * n + k] / matrix[k * n + k];
            for (int j = 0; j < n; j++) {
                matrix[(i+1) * n + j] -= c * matrix[k * n + j];
            }
            i++;
        }
    }

    for (int i = 0; i < n; i++) {
        det *= matrix[i * n + i];
    }

//     //clear matrix
//     for(int i = 0; i < n; i++) {
//         delete [] matrix[i];
//     }
//     delete [] matrix;

    return det;
}


}
