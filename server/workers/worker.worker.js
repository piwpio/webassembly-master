const {generateSortFeed} = require('../utils');

const init = () => {
  process.on('message', function(msg) {
    if (msg.event === 'runTest') {
      sendMemoryUsage()

      if (msg.data.isWasm) {
        runWasm(msg);

      } else {
        runJs(msg);
      }
    }
  });

  process.send({ event: 'ready' });
}

function runWasm(msg) {
  const fs = require('fs');
  const wasmBuffer = fs.readFileSync(`${msg.data.file}`);
  WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
    const tmpData = generateSortFeed(10);
    const test = wasmModule.instance.exports[msg.data.method];
    const memory = wasmModule.instance.exports.memory;
    const array = new Float32Array(memory.buffer, 0, tmpData.length);
    array.set(tmpData);
    test(array, array.byteOffset, array.length - 1);
    // console.log(array)
    sendMemoryUsage();
    sendResults();
  });
}

function runJs(msg) {
  const tmpData = generateSortFeed(10);
  const test = require(`../scripts/${msg.data.script}`)[msg.data.method];
  test(tmpData, 0, tmpData.length - 1);
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
