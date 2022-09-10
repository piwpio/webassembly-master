const path = require('path');
const file = path.join(__dirname, 'wasm', 'matrix-detO3.wasm')
const fs = require('fs');
const wasmBuffer = fs.readFileSync(file);

const { argv, env } = require('node:process');

WebAssembly.instantiate(wasmBuffer, {
  env: {
    emscripten_random: Math.random
  },
  wasi_snapshot_preview1: {
    proc_exit: console.log,
  },
}).then(wasmModule => {
  const test = wasmModule.instance.exports['gaussElimination'];
  const memory = wasmModule.instance.exports.memory;

  let a = test(10);
  console.log(a);
});
