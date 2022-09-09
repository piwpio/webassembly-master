const { parentPort } = require('worker_threads')
const { performance } = require("perf_hooks")

parentPort.on("message", msg => {
  if (msg.event === 'runTest') {
    // console.log('WORKER THREAD RUN TEST');
    const data = msg.data;
    if (data.testSuite.isWasm) {
      runWasm(data.testType, data.testSuite, data.testData, data.testRepeatTimes);
    } else {
      runJs(data.testType, data.testSuite, data.testData, data.testRepeatTimes);
    }
  }
});

parentPort.postMessage({ event: 'ready' });

function runWasm(testType, testSuite, testData, testRepeatTimes) {
  const fs = require('fs');
  const wasmBuffer = fs.readFileSync(`${testSuite.file}`);

  // const memory = new WebAssembly.Memory({
  //   initial: 1024,
  //   maximum: 1024
  // });
  // WebAssembly.instantiate(wasmBuffer, { env: { memory: memory }}).then(wasmModule => {
  WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
    // const memoryRes = [];
    // const performanceRes = [];
    // for (let i = 0; i < testRepeatTimes; i++) {
      const test = wasmModule.instance.exports[testSuite.method];
      const memory = wasmModule.instance.exports.memory;
      const testStartTime = performance.now();

      if (testType === 'sort') {
        const array = new Float32Array(memory.buffer, 0, testData.length);
        array.set(testData);
        test(array, array.byteOffset, array.length - 1);
      }

      const testEndTime = performance.now();
      const p = testEndTime - testStartTime;
      const m = process.memoryUsage();
      // memoryRes.push(m);
      // performanceRes.push(p)
    // }

    // sendResults(memoryRes, performanceRes, testSuite.testIndex, testSuite.testLabel);
    sendResults(m, p, testSuite.testIndex, testSuite.testLabel);
  });
}

function runJs(testType, testSuite, testData, testRepeatTimes) {
  const test = require(`../scripts/${testSuite.script}`)[testSuite.method];
  // const memoryRes = [];
  // const performanceRes = [];
  // for (let i = 0; i < testRepeatTimes; i++) {
    const testStartTime = performance.now()

    if (testType === 'sort') {
      test(testData, 0, testData.length - 1);
    }

    const testEndTime = performance.now()
    const p = testEndTime - testStartTime;
    const m = process.memoryUsage();
    // memoryRes.push(m);
    // performanceRes.push(p)
  // }

  // sendResults(memoryRes, performanceRes, testSuite.testIndex, testSuite.testLabel);
  sendResults(m, p, testSuite.testIndex, testSuite.testLabel);
}

function sendResults(memoryUsage, performance, testIndex, testLabel) {
  parentPort.postMessage({
    event: 'results',
    data: {
      testIndex: testIndex,
      testLabel: testLabel,
      memory: memoryUsage,
      performance: performance
    }
  });
}

function sendMemoryUsage() {
  parentPort.postMessage({
    event: 'memoryUsage',
    data: process.memoryUsage()
  });
}
