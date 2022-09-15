const path = require('path');
const wasmO2Path = path.join(__dirname, '..', 'wasm', 'fibonacciO3.wasm')

exports.testSuites = [
  { testLabel: 'WASM Fibonacci', isWasm: true, file: wasmO2Path,  method: 'fibonacci'},
  { testLabel: 'JS Fibonacci', isWasm: false, script: 'fibonacci.js',  method: 'fibonacci'},
];
