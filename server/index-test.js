const path = require('path');
const file = path.join(__dirname, 'wasm', 'elementalO3.wasm')
const fs = require('fs');
const {generateSortFeed, getPagesToGrow} = require('./utils');
const wasmBuffer = fs.readFileSync(file);
const {performance} = require('perf_hooks');
const {matrixMul} = require('./scripts/matrix-mul');

const size = 10000;

WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
  const test = wasmModule.instance.exports['elemental'];
  const memory = wasmModule.instance.exports.memory;

  const testData = generateSortFeed(size, false, 100);

  const pagesToAllocate = getPagesToGrow(memory, Float64Array, size); // because 3 matrixes
  if (pagesToAllocate > 0) {
    memory.grow(pagesToAllocate);
  }

  // pamiętać, aby przekazać odpowiedni typ tablicy!!! double = Float64Array, float = Float32Array
  const array = new Float64Array(memory.buffer, 0, testData.length);
  array.set(testData);


  const t1 = performance.now();
  test(size, array);
  const t2 = performance.now();
  console.log(t2-t1);
  // console.log(array);
});

// const array = generateSortFeed(size, false, 100);
// const t1 = performance.now();
// pierwiastkiJs(array);
// const t2 = performance.now();
// console.log(t2-t1);
// // console.log(array);
//
// function pierwiastkiJs(array) {
//   console.log(array);
//   for (let i = 0; i < array.length; i++) {
//     array[i] = Math.sqrt(array[i]);
//   }
// }

