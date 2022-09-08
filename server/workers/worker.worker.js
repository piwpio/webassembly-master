const {generateSortFeed} = require('../utils');

const init = () => {
  process.on('message', function(msg) {
    if (msg.event === 'runTest') {
      // sendMemoryUsage()
      // const data = generateSortFeed(2000000);
      const data = generateSortFeed(100000);

      performance.mark("start")
      if (msg.data.isWasm) {
        runWasm(msg, data);
      } else {
        runJs(msg, data);
      }
    }
  });

  process.send({ event: 'ready' });
}

function runWasm(msg, data) {
  const fs = require('fs');
  const wasmBuffer = fs.readFileSync(`${msg.data.file}`);

  const memory = new WebAssembly.Memory({
    initial: 1024,
    maximum: 1024
  });
  WebAssembly.instantiate(wasmBuffer, { env: { memory: memory }}).then(wasmModule => {
    const test = wasmModule.instance.exports[msg.data.method];
    // const memory = wasmModule.instance.exports.memory;
    const array = new Float32Array(memory.buffer, 0, data.length);
    array.set(data);
    test(array, array.byteOffset, array.length - 1);
    performance.mark("end")
    const m = process.memoryUsage();
    const p = performance.measure("p", "start", "end")
    sendResults(m, p, msg.data.testIndex, msg.data.testLabel);
  });
}

function runJs(msg, data) {
  const test = require(`../scripts/${msg.data.script}`)[msg.data.method];
  test(data, 0, data.length - 1);
  performance.mark("end")
  const m = process.memoryUsage();
  const p = performance.measure("p", "start", "end")
  sendResults(m, p, msg.data.testIndex, msg.data.testLabel);
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
