const {performance} = require('perf_hooks');
const {generateSortFeed, getPagesToGrow} = require('../utils');
const {generateArrayForCholesky} = require('../scripts/cholesky');

exports.test = function(msg) {
  if (msg.event !== 'runTest') {
    return new Promise(resolve => {resolve(null)});
  }

  const data = msg.data;
  if (data.testSuite.isWasm) {
     return runWasm(data.testType, data.testSuite, data.testData, data.testRepeatTimes);
  } else {
     return runJs(data.testType, data.testSuite, data.testData, data.testRepeatTimes);
  }
}

function runWasm(testType, testSuite, testData, testRepeatTimes) {
  return new Promise(resolve => {
    const fs = require('fs');
    const wasmBuffer = fs.readFileSync(`${testSuite.file}`);

    // const memory = new WebAssembly.Memory({
    //   initial: 1024,
    //   maximum: 1024
    // });
    // {
    //   env: {
    //     emscripten_random: Math.random,
    //     memory: memory
    //   },
    //   wasi_snapshot_preview1: {
    //     proc_exit: console.log
    //   },
    // }

    WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
      const test = wasmModule.instance.exports[testSuite.method];
      const memory = wasmModule.instance.exports.memory;

      let m1, m2;
      const ps = performance.now();

      if (testType === 'sort') {
        const array = new Float32Array(memory.buffer, 0, testData.length);
        array.set(testData);
        test(array, array.byteOffset, array.length - 1);
        m1 = process.memoryUsage();

      } else if (testType === 'matrix-det') {
        const data = generateSortFeed(Math.pow(testData, 2), false, 10);
        const pagesToAllocate = getPagesToGrow(memory, Float64Array, Math.pow(testData, 2));
        if (pagesToAllocate > 0) {
          memory.grow(pagesToAllocate);
        }
        const array = new Float64Array(memory.buffer, 0, data.length);
        array.set(data);
        let a = test(testData, array);
        m1 = process.memoryUsage();

      } else if (testType === 'matrix-mul') {
        const data1 = generateSortFeed(Math.pow(testData, 2), false, 100);
        const data2 = generateSortFeed(Math.pow(testData, 2), false, 100);
        const data3 = Array.from({length:  Math.pow(testData, 2)}, e => 0);

        const pagesToAllocate = getPagesToGrow(memory, Float64Array, Math.pow(testData, 2) * 3);
        if (pagesToAllocate > 0) {
          memory.grow(pagesToAllocate);
        }

        const matrix1 = new Float64Array(memory.buffer, 0, data1.length);
        const matrix2 = new Float64Array(memory.buffer, Float64Array.BYTES_PER_ELEMENT * Math.pow(testData, 2), data2.length);
        const results = new Float64Array(memory.buffer, Float64Array.BYTES_PER_ELEMENT * Math.pow(testData, 2) * 2, data3.length);
        matrix1.set(data1);
        matrix2.set(data2);
        results.set(data3);

        test(testData, matrix1.byteOffset, matrix2.byteOffset, results.byteOffset);
        m1 = process.memoryUsage();

      } else if (testType === 'cholesky') {
        const data1 = generateArrayForCholesky(testData, 0, 100);
        const data2 = Array.from({length:  Math.pow(testData, 2)}, e => 0);
        const matrix = new Float64Array(memory.buffer, 0, data1.length);
        const lower = new Float64Array(memory.buffer, Float64Array.BYTES_PER_ELEMENT * Math.pow(testData, 2), data2.length);
        matrix.set(data1);
        lower.set(data2);
        test(testData, matrix.byteOffset, lower.byteOffset);
        m1 = process.memoryUsage();

      } else if (testType === 'quicksort') {
        const data = generateSortFeed(testData, false, 100);

        const pagesToAllocate = getPagesToGrow(memory, Float64Array, testData * 2);
        if (pagesToAllocate > 0) {
          memory.grow(pagesToAllocate);
        }

        const array = new Float64Array(memory.buffer, 0, data.length);
        array.set(data);

        test(array.byteOffset, 0, testData-1);
        m1 = process.memoryUsage();

      } else if (testType === 'fibonacci') {
        const a = test(testData);
        m1 = process.memoryUsage();
      }

      const pe = performance.now();
      const p = pe - ps;

      resolve({
        memory: [m1, m2],
        performance: p,
        testIndex: testSuite.testIndex,
        testLabel: testSuite.testLabel
      });
    });
  });
}

function runJs(testType, testSuite, testData, testRepeatTimes) {
  return new Promise(resolve => {
    const test = require(`../scripts/${testSuite.script}`)[testSuite.method];

    let visualization;
    let m1, m2;
    const ps = performance.now();

    if (testType === 'sort') {
      m1 = process.memoryUsage();
      test(testData, 0, testData.length - 1);
      visualization = testData;

    } else if (testType === 'matrix-det') {
      const array = generateSortFeed(Math.pow(testData, 2), false, 10);
      let a = test(testData, array);
      m1 = process.memoryUsage();

    } else if (testType === 'matrix-mul') {
      const matrix1 = generateSortFeed(Math.pow(testData, 2), false, 100);
      const matrix2 = generateSortFeed(Math.pow(testData, 2), false, 100);
      const results = Array.from({length: Math.pow(testData, 2)}, e => 0);
      test(testData, matrix1, matrix2, results);
      m1 = process.memoryUsage();

    } else if (testType === 'cholesky') {
      const matrix = generateArrayForCholesky(testData, 0, 100);
      const lower = Array.from({length:  Math.pow(testData, 2)}, e => 0);
      test(testData, matrix, lower);
      m1 = process.memoryUsage();

    } else if (testType === 'quicksort') {
      const array = generateSortFeed(testData, false, 100);
      test(array, 0, testData-1);
      m1 = process.memoryUsage();

    } else if (testType === 'fibonacci') {
      const a = test(testData);
      m1 = process.memoryUsage();
    }

    const pe = performance.now();
    const p = pe - ps;

    resolve({
      memory: [m1, m2],
      performance: p,
      testIndex: testSuite.testIndex,
      testLabel: testSuite.testLabel,
      visualization: visualization,
    });
  });
}
