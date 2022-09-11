const path = require('path');
const file = path.join(__dirname, 'wasm', 'matrix-detO3.wasm')
const fs = require('fs');
const {generateSortFeed} = require('./utils');
const wasmBuffer = fs.readFileSync(file);
const {performance} = require('perf_hooks');
const {gaussElimination, gaussElimination2} = require('./scripts/matrix-det');

WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
  const test = wasmModule.instance.exports['gaussElimination'];
  const memory = wasmModule.instance.exports.memory;

  // const matrixSize = 3;
  // const testData = [12,23,34,45,56,67,78,89,90];
  const matrixSize = 4000;
  const testData = generateSortFeed(matrixSize*matrixSize);

  // pamiętać, aby przekazać odpowiedni typ tablicy!!! double = Float64Array, float = Float32Array
  const array = new Float64Array(memory.buffer, 0, testData.length);
  array.set(testData);

  const t1 = performance.now();
  let a = test(matrixSize, array);
  const t2 = performance.now();
  console.log(t2-t1);
  // console.log(a, array);
});

// // const matrixSize = 3;
// // const array = [12,23,34,45,56,67,78,89,90];
// const matrixSize = 4000;
// const array = generateSortFeed(matrixSize*matrixSize);
// const t1 = performance.now();
// let a = gaussElimination(matrixSize, array)
// const t2 = performance.now();
// console.log(t2-t1);
// // console.log(a, array);

// // const matrixSize = 3;
// // const array = [[12,23,34],[45,56,67],[78,89,90]];
// const matrixSize = 2000;
// const array = [];
// for (let i = 0; i < matrixSize; i++) {
//   array[i] = generateSortFeed(matrixSize)
// }
// const t1 = performance.now();
// let a = gaussElimination2(array)
// const t2 = performance.now();
// console.log(t2-t1);
// // console.log(a, array);

