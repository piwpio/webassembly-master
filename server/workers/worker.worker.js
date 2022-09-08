const {generateSortFeed} = require('../utils');
const { performance } = require("perf_hooks")

const init = () => {
  process.on('message', function(msg) {
    if (msg.event === 'runTest') {
      const data = msg.data;
      if (data.testSuite.isWasm) {
        runWasm(data.testType, data.testSuite, data.testData);
      } else {
        runJs(data.testType, data.testSuite, data.testData);
      }
    }
  });

  process.send({ event: 'ready' });
}

function runWasm(testType, testSuite, testData) {
  const fs = require('fs');
  const wasmBuffer = fs.readFileSync(`${testSuite.file}`);

  const memory = new WebAssembly.Memory({
    initial: 1024,
    maximum: 1024
  });
  WebAssembly.instantiate(wasmBuffer, { env: { memory: memory }}).then(wasmModule => {
    const test = wasmModule.instance.exports[testSuite.method];
    // const memory = wasmModule.instance.exports.memory;
    const testStartTime = performance.now();

    if (testType === 'sort') {
      const array = new Float32Array(memory.buffer, 0, testData.length);
      array.set(testData);
      test(array, array.byteOffset, array.length - 1);
    }

    const testEndTime = performance.now();
    const m = process.memoryUsage();
    const p = testEndTime - testStartTime;
    sendResults(m, p, testSuite.testIndex, testSuite.testLabel);
  });
}

function runJs(testType, testSuite, testData) {
  const test = require(`../scripts/${testSuite.script}`)[testSuite.method];
  const testStartTime = performance.now()

  if (testType === 'sort') {
    test(testData, 0, testData.length - 1);
  }

  const testEndTime = performance.now()
  const m = process.memoryUsage();
  const p = testEndTime - testStartTime;

  sendResults(m, p, testSuite.testIndex, testSuite.testLabel);
}

function sendResults(memoryUsage, performance, testIndex, testLabel) {
  process.send({
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
  process.send({
    event: 'memoryUsage',
    data: process.memoryUsage()
  });
}

module.exports = {
  init
}
