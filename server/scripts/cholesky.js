function generateArrayForCholesky(n, min, max) {
  const array = Array.from({length: n * n}, e => 0);
  const arrayForCholesky = Array.from({length: n * n}, e => 0);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      // array[i * n + j] = Math.floor(Math.random() * 10) + min;
      // array[i * n + j] = Math.random() * (max - min) + min;
      array[i * n + j] = Math.floor(Math.random() * max) + 1;
    }
  }

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      arrayForCholesky[i * n + j] = 0;
      for (let k = 0; k < n; k++) {
        arrayForCholesky[i * n + j] += array[i * n + k] * array[j * n + k];
      }
    }
  }

  // for (let i = 0; i < n; i++) {
  //   let val = '';
  //   for (let j = 0; j < n; j++) {
  //     val += `${arrayForCholesky[i * n + j]}\t`;
  //   }
  //   console.log(val);
  // }

  return arrayForCholesky;
}

function cholesky(n, matrix, lower) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let sum = 0;

      if (j === i) {
        for (let k = 0; k < j; k++) {
          sum += lower[j * n + k] * lower[j * n + k];
        }
        lower[j * n + j] = Math.sqrt(matrix[j * n + j] - sum);
      } else {
        for (let k = 0; k < j; k++) {
          sum += (lower[i * n + k] * lower[j * n + k]);
        }
        lower[i * n + j] = (matrix[i * n + j] - sum) / lower[j * n + j];
      }
    }
  }
}

exports.cholesky = cholesky;
exports.generateArrayForCholesky = generateArrayForCholesky;
