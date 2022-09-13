const {performance} = require('perf_hooks');

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
        m1 = process.memoryUsage();
        test(array, array.byteOffset, array.length - 1);
        // m2 = process.memoryUsage();
      } else if (testType === 'matrix-det') {
        let a = test(testData);
        console.log(a);
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
      // m2 = process.memoryUsage();
      visualization = testData;
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
