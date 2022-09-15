function matrixMul(n, matrix1, matrix2, matrixRes) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        matrixRes[i * n + j] += matrix1[i * n + k] * matrix2[k * n + j];
      }
    }
  }
}

exports.matrixMul = matrixMul;
