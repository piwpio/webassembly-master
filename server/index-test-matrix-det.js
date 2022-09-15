const path = require('path');
const file = path.join(__dirname, 'wasm', 'matrix-detO3.wasm')
const fs = require('fs');
const {generateSortFeed, getPagesToGrow} = require('./utils');
const wasmBuffer = fs.readFileSync(file);
const {performance} = require('perf_hooks');
const {matrixDet} = require('./scripts/matrix-det');

WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
  const test = wasmModule.instance.exports['matrixDet'];
  const memory = wasmModule.instance.exports.memory;

  // const matrixSize = 3;
  // const testData = [12,23,34,45,56,67,78,89,90];
  const matrixSize = 1500;
  const testData = generateSortFeed(Math.pow(matrixSize,2), false, 10);

  const pagesToAllocate = getPagesToGrow(memory, Float64Array, Math.pow(matrixSize, 2));
  if (pagesToAllocate > 0) {
    memory.grow(pagesToAllocate);
  }

  // pamiętać, aby przekazać odpowiedni typ tablicy!!! double = Float64Array, float = Float32Array
  const array = new Float64Array(memory.buffer, 0, testData.length);
  array.set(testData);

  const t1 = performance.now();
  let a = test(matrixSize, array);
  const t2 = performance.now();
  console.log(t2-t1);
  console.log(a, array);
});

// // const matrixSize = 3;
// // const array = [12,23,34,45,56,67,78,89,90];
// const matrixSize = 1500;
// const array = generateSortFeed(Math.pow(matrixSize,2), false, 10);
// const t1 = performance.now();
// let a = matrixDet(matrixSize, array)
// const t2 = performance.now();
// console.log(t2-t1);
// console.log(a, array);

