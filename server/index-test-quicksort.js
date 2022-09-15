const path = require('path');
const file = path.join(__dirname, 'wasm', 'quicksortO3.wasm')
const fs = require('fs');
const {generateSortFeed, getPagesToGrow} = require('./utils');
const wasmBuffer = fs.readFileSync(file);
const {performance} = require('perf_hooks');
const {quicksort} = require('./scripts/quicksort');

const size = 6_000_000; // + 4*(64/Float64Array.BYTES_PER_ELEMENT * 1024);

WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
  const test = wasmModule.instance.exports['quicksort'];
  const memory = wasmModule.instance.exports.memory;

  const testData = generateSortFeed(size, false, 100);

  const pagesToAllocate = getPagesToGrow(memory, Float64Array, size);
  console.log(pagesToAllocate);
  if (pagesToAllocate > 0) {
    memory.grow(pagesToAllocate);
  }

  // pamiętać, aby przekazać odpowiedni typ tablicy!!! double = Float64Array, float = Float32Array
  const array = new Float64Array(memory.buffer, 0, testData.length);
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

