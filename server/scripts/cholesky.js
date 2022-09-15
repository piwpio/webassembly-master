function generateArrayForCholesky(n, min, max) {
  const array = Array.from({length: n * n}, e => 0);
  const array2 = Array.from({length: n * n}, e => 0);
  const arrayForCholesky = Array.from({length: n * n}, e => 0);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      // array[i * n + j] = Math.floor(Math.random() * 10) + 1;
      array[i * n + j] = Math.random() * (max - min) + min;
    }
  }
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      array2[i * n + j] = array[j * n + i];
    }
  }
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      arrayForCholesky[i * n + j] = 0;
      for (let k = 0; k < n; k++) {
        arrayForCholesky[i * n + j] += array[i * n + k] * array2[k * n + j];
      }
    }
  }

  // for (let i = 0; i < n; i++) {
  //   console.log(`${arrayForCholesky[i * n]}\t${arrayForCholesky[i * n + 1]}\t${arrayForCholesky[i * n + 2]}`)
  // }

  return arrayForCholesky;
}

function generateArrayForCholesky2(n, min, max) {
  const array = Array.from({length: n * n}, e => 0);
  const arrayForCholesky = Array.from({length: n * n}, e => 0);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      array[i * n + j] = Math.floor(Math.random() * 10) + min;
      // array[i * n + j] = Math.random() * (max - min) + min;
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
exports.generateArrayForCholesky2 = generateArrayForCholesky2;
