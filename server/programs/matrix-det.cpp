#include <emscripten.h>
#include <iostream>

extern "C" {

double round(double value) {
    return ((long)(value * 100 + .5) / 100.0);
}

EMSCRIPTEN_KEEPALIVE
double gaussElimination(int n)
{
    // generate matrix with numbers from 1 to 1000
    double **matrix = new double*[n];
    for(int i = 0; i < n; i++) {
        matrix[i] = new double[n];
    }
    for (int a = 0; a < n; a++) {
        for (int b = 0; b < n; b++) {
           matrix[a][b] = std::floor(emscripten_random() * 10 + 1);
        }
    }

    double tmp;
    double det = 1;
    for (int k = 0; k < n - 1; k++) {
        for (int i = k; i < n - 1;) {
            // if diagonal number equals 0 swap it with other row
            if (matrix[k][k] == 0) {
                int swapIndex = 0;
                for (int l = i+1; l < n; l++) {
                    if (matrix[l][k] != 0) {
                        swapIndex = l;
                        break;
                    }
                }

                // check if there is row without 0. If not this column is already done;
                if (swapIndex == 0) {
                    i++;
                    continue;
                }

                // swap rows
                for (int q = 0; q < n; q++) {
                    tmp = matrix[k][q];
                    matrix[k][q] = matrix[swapIndex][q];
                    matrix[swapIndex][q] = tmp;
                }
                continue;
            }

            double c = matrix[i+1][k] / matrix[k][k];
            for (int j = 0; j < n; j++) {
                matrix[i+1][j] -= c * matrix[k][j];
                matrix[i+1][j] = round(matrix[i+1][j]);
            }
            i++;
        }
    }

    for (int i = 0; i < n; i++) {
        det *= matrix[i][i];
        det = round(det);
    }

    //clear matrix
    for(int i = 0; i < n; i++) {
        delete [] matrix[i];
    }
    delete [] matrix;

    return det;
}


}
