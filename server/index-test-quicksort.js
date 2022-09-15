const path = require('path');
const file = path.join(__dirname, 'wasm', 'quicksortO3.wasm')
const fs = require('fs');
const {generateSortFeed} = require('./utils');
const wasmBuffer = fs.readFileSync(file);
const {performance} = require('perf_hooks');
const {quicksort} = require('./scripts/quicksort');

const size = 10;

WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
  const test = wasmModule.instance.exports['quicksort'];
  const memory = wasmModule.instance.exports.memory;

  const testData = generateSortFeed(size, false, 100);

  // pamiętać, aby przekazać odpowiedni typ tablicy!!! double = Float64Array, float = Float32Array
  const array = new Float32Array(memory.buffer, 0, testData.length);
  array.set(testData);

  const t1 = performance.now();
  test(array.byteOffset, 0, size-1);
  const t2 = performance.now();
  console.log(t2-t1);
  console.log(process.memoryUsage());
  // console.log(array);
});

// const array = generateSortFeed(size, false, 100);
//
// const t1 = performance.now();
// quicksort(array, 0, size-1);
// const t2 = performance.now();
// console.log(t2-t1);
// console.log(process.memoryUsage());
// // console.log(array);

