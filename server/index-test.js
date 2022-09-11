const path = require('path');
const file = path.join(__dirname, 'wasm', 'choleskyO3.wasm')
const fs = require('fs');
const wasmBuffer = fs.readFileSync(file);
const {performance} = require('perf_hooks');
const {generateArrayForCholesky2, cholesky} = require('./scripts/cholesky');

WebAssembly.instantiate(wasmBuffer, {
  env: {
    emscripten_random: Math.random,
  },
  wasi_snapshot_preview1: {
    proc_exit: process.kill
  }
}).then(wasmModule => {
  const test = wasmModule.instance.exports['cholesky'];
  const generate = wasmModule.instance.exports['generateCholeskyMatrix'];
  const memory = wasmModule.instance.exports.memory;
  let t1, t2;
  // const matrixSize = 3;
  // const matrixTestData = [4, 12, -16, 12, 37, -43, -16, -43, 98];
  // const lowerTestData = Array(matrixTestData.length).fill(0);
  // [[2, 0, 0][6, 1, 0][-8, 5, 3]] [[2, 6, -8][0, 1, 5][0, 0, 3]]

  const matrixSize = 100;

  const matrixTestData = Array(matrixSize * matrixSize).fill(0);
  const matrix = new Float64Array(memory.buffer, 0, matrixTestData.length);
  matrix.set(matrixTestData);

  t1 = performance.now();
  generate(matrixSize, matrix, 0, 1);
  t2 = performance.now();
  console.log(t2-t1);
  // console.log(matrix);

  const lowerTestData = Array(matrixSize * matrixSize).fill(0);
  const lower = new Float64Array(memory.buffer, Float64Array.BYTES_PER_ELEMENT * (matrixSize * matrixSize), lowerTestData.length);
  lower.set(lowerTestData);

  t1 = performance.now();
  test(matrixSize, matrix, matrixTestData.length, lower);
  t2 = performance.now();
  console.log(t2-t1);
  // console.log(lower);
});



// let t1, t2;
// // const matrixSize = 3;
// // const matrixTestData = [4, 12, -16, 12, 37, -43, -16, -43, 98];
// // const lowerTestData = Array(matrixTestData.length).fill(0);
// // [[2, 0, 0][6, 1, 0][-8, 5, 3]] [[2, 6, -8][0, 1, 5][0, 0, 3]]
//
// const matrixSize = 80;
//
// t1 = performance.now();
// const matrix = generateArrayForCholesky2(matrixSize, 1, 10);
// t2 = performance.now();
// console.log(t2-t1);
// // console.log(matrix);
// // console.log(process.memoryUsage())
//
//
// t1 = performance.now();
// const lower = cholesky(matrixSize, matrix);
// t2 = performance.now();
// console.log(t2-t1);
// // console.log(lower);

