function gaussElimination(n, matrix) {
  let det = 1;
  for (let k = 0; k < n - 1; k++) {
    for (let i = k; i < n - 1;) {
      // if diagonal number equals 0 swap it with other row
      if (matrix[k * n + k] === 0) {
        let swapIndex;
        for (let l = i+1; l < n; l++) {
          if (matrix[l * n + k] !== 0) {
            swapIndex = l;
            break;
          }
        }

        // check if there is row without 0. If not this column is already done;
        if (swapIndex === undefined) {
          i++;
          continue;
        }

        // swap rows
        for (let q = 0; q < n; q++) {
          const tmp = matrix[k * n + q];
          matrix[k * n + q] = matrix[swapIndex * n + q];
          matrix[swapIndex * n + q] = tmp;
        }
        continue;
      }

      const c = matrix[(i+1) * n + k] / matrix[k * n + k];
      for (let j = 0; j < n; j++) {
        matrix[(i+1) * n + j] -= c * matrix[k * n + j];
      }
      i++;
    }
  }
  for (let i = 0; i < n; i++) {
    det *= matrix[i * n + i];
  }

  return det;
}

exports.gaussElimination = gaussElimination;
