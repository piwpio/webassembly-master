const path = require('path');
const file = path.join(__dirname, 'wasm', 'matrix-detO3.wasm')
const fs = require('fs');
const wasmBuffer = fs.readFileSync(file);

WebAssembly.instantiate(wasmBuffer, {
  env: {
    emscripten_random: Math.random,
  },
  wasi_snapshot_preview1: {
    proc_exit: console.log
  },
}).then(wasmModule => {
  const test = wasmModule.instance.exports['gaussElimination'];
  const memory = wasmModule.instance.exports.memory;

  let a = test(1000, [12,23,34,45,56,67,78,89,90]);
  console.log(a);
});
