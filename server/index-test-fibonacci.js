const path = require('path');
const file = path.join(__dirname, 'wasm', 'fibonacciO3.wasm');
const filesystem = require('fs');
const wasmBuffer = filesystem.readFileSync(file);

WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
  const fibonacci = wasmModule.instance.exports.fibonacci;
  const n = 10;
  console.log(`Wynik fibonacci n = ${n} to ${fibonacci(n)}\n`);
});
