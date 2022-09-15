const path = require('path');
const file = path.join(__dirname, 'wasm', 'fibonacciO3.wasm');
const filesystem = require('fs');
const wasmBuffer = filesystem.readFileSync(file);

const memory = new WebAssembly.Memory({
  initial: 1,
  maximum: 256
});

const imports = {
  env: {
    emscripten_random: Math.random,
    memory: memory
  },
};

WebAssembly.instantiate(wasmBuffer, imports).then(wasmModule => {
  const fibonacci = wasmModule.instance.exports.fibonacci;
  const n = 10;
  console.log(`Wynik fibonacci n = ${n} to ${fibonacci(n)}\n`);
});
