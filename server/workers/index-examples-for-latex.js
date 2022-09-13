const patch = require('path');
const file = path.join(__dirname, 'fibonacci.wasm');
const filesystem = require('fs');
const wasmBuffer = fs.readFileSync(file);

const memory = new WebAssembly.Memory({
  initial: 1,
  maximum: 256
});
const imports =
  WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
    const fibonacci = wasmModule.instance.exports.fibonacci;
    const memory = wasmModule.instance.exports.memory;
    const n = 10;
    console.log(`Wynik fibonacci n = ${n} to ${fibonacci(55)}`);
  })
