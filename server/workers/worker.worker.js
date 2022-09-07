const {generateSortFeed} = require('../utils');

const init = () => {
  process.on('message', function(msg) {
    if (msg.event === 'runTest') {
      // sendMemoryUsage()
      // const data = generateSortFeed(2000000);
      const data = generateSortFeed(1000000);

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
  WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
    // console.log(wasmModule.instance.exports.memory);
    const test = wasmModule.instance.exports[msg.data.method];
    const memory = wasmModule.instance.exports.memory;
    const array = new Float32Array(memory.buffer, 0, data.length);
    array.set(data);
    test(array, array.byteOffset, array.length - 1);
    // console.log(array)
    sendMemoryUsage();
    sendResults();
  });
}

function runJs(msg, data) {
  const test = require(`../scripts/${msg.data.script}`)[msg.data.method];
  test(data, 0, data.length - 1);
  // console.log(tmpData)
  sendMemoryUsage()
  sendResults();
}

function sendMemoryUsage() {
  process.send({
    event: 'memoryUsage',
    data: process.memoryUsage()
  });
}

function sendResults() {
  process.send({
    event: 'results',
    data: process.memoryUsage()
  });
}

module.exports = {
  init
}
