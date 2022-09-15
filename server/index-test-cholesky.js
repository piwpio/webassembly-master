const path = require('path');
const file = path.join(__dirname, 'wasm', 'choleskyO3.wasm')
const fs = require('fs');
const wasmBuffer = fs.readFileSync(file);
const {performance} = require('perf_hooks');
const {generateArrayForCholesky, cholesky} = require('./scripts/cholesky');
const {generateSortFeed} = require('./utils');

const matrixSize = 200;

WebAssembly.instantiate(wasmBuffer, {
  env: {
    emscripten_random: Math.random,
  },
  // wasi_snapshot_preview1: {
  //   proc_exit: process.kill
  // }
}).then(wasmModule => {
  const test = wasmModule.instance.exports['cholesky'];
  const memory = wasmModule.instance.exports.memory;

  // const testData1 = [4, 12, -16, 12, 37, -43, -16, -43, 98];
  const testData1 = generateArrayForCholesky(matrixSize, false, 100);
  const testData2 = Array.from({length:  Math.pow(matrixSize, 2)}, e => 0);
  const matrix = new Float64Array(memory.buffer, 0, testData1.length);
  const lower = new Float64Array(memory.buffer, Float64Array.BYTES_PER_ELEMENT * Math.pow(matrixSize, 2), testData2.length);
  matrix.set(testData1);
  lower.set(testData2);

  const t1 = performance.now();
  test(matrixSize, matrix.byteOffset, lower.byteOffset);
  const t2 = performance.now();
  console.log(t2-t1);
  // console.log(lower);
});


// // const matrix = [4, 12, -16, 12, 37, -43, -16, -43, 98];
// const matrix = generateArrayForCholesky(matrixSize, false, 100);
// const lower = Array.from({length:  Math.pow(matrixSize, 2)}, e => 0);
//
// const t1 = performance.now();
// cholesky(matrixSize, matrix, lower);
// const t2 = performance.now();
// console.log(t2-t1);
// // console.log(lower);

