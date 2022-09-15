const path = require('path');
const file = path.join(__dirname, 'wasm', 'matrix-mulO3.wasm')
const fs = require('fs');
const {generateSortFeed, getPagesToGrow} = require('./utils');
const wasmBuffer = fs.readFileSync(file);
const {performance} = require('perf_hooks');
const {matrixMul} = require('./scripts/matrix-mul');

const matrixSize = 1500;

WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
  const test = wasmModule.instance.exports['matrixMul'];
  const memory = wasmModule.instance.exports.memory;

  // const testData1 = [1,1,1,2,2,2,3,3,3];
  // const testData2 = [1,1,1,2,2,2,3,3,3]; /// wynik [6,  6,  6, 12, 12, 12, 18, 18, 18]
  const testData1 = generateSortFeed(Math.pow(matrixSize, 2), false, 100);
  const testData2 = generateSortFeed(Math.pow(matrixSize, 2), false, 100);
  const testData3 = Array.from({length:  Math.pow(matrixSize, 2)}, e => 0);

  const pagesToAllocate = getPagesToGrow(memory, Float64Array, Math.pow(matrixSize, 2) * 3); // because 3 matrixes
  console.log(pagesToAllocate);
  if (pagesToAllocate > 0) {
    console.log(memory.buffer.byteLength / (64 * 1024));
    memory.grow(pagesToAllocate);
    console.log(memory.buffer.byteLength / (64 * 1024));
  }
  console.log('------');


  // pamiętać, aby przekazać odpowiedni typ tablicy!!! double = Float64Array, float = Float32Array
  const matrix1 = new Float64Array(memory.buffer, 0, testData1.length);
  const matrix2 = new Float64Array(memory.buffer, Float64Array.BYTES_PER_ELEMENT * Math.pow(matrixSize, 2), testData2.length);
  const results = new Float64Array(memory.buffer, Float64Array.BYTES_PER_ELEMENT * Math.pow(matrixSize, 2) * 2, testData3.length);
  matrix1.set(testData1);
  matrix2.set(testData2);
  results.set(testData3);


  const t1 = performance.now();
  test(matrixSize, matrix1.byteOffset, matrix2.byteOffset, results.byteOffset);
  const t2 = performance.now();
  console.log(t2-t1);
  // console.log(process.memoryUsage());
  console.log(process.memoryUsage().rss / 1048576 );
  console.log(process.memoryUsage().external / 1048576 );
  console.log(process.memoryUsage().heapTotal / 1048576 );
  console.log(process.memoryUsage().heapUsed / 1048576 );
  // console.log(results);
});


// // const matrix1 = [1,1,1,2,2,2,3,3,3];
// // const matrix2 = [1,1,1,2,2,2,3,3,3]; /// wynik [6,  6,  6, 12, 12, 12, 18, 18, 18]
// const matrix1 = generateSortFeed(matrixSize*matrixSize, false, 100);
// const matrix2 = generateSortFeed(matrixSize*matrixSize, false, 100);
// const results = Array.from({length: matrixSize * matrixSize}, e => 0);
//
// const t1 = performance.now();
// matrixMul(matrixSize, matrix1, matrix2, results);
// const t2 = performance.now();
// console.log(t2-t1);
// // console.log(process.memoryUsage());
// console.log(process.memoryUsage().rss / 1048576 );
// console.log(process.memoryUsage().external / 1048576 );
// console.log(process.memoryUsage().heapTotal / 1048576 );
// console.log(process.memoryUsage().heapUsed / 1048576 );
// // console.log(results);

