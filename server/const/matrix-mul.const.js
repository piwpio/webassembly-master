const path = require('path');
const wasmO2Path = path.join(__dirname, '..', 'wasm', 'matrix-mulO3.wasm')

exports.testSuites = [
  { testLabel: 'WASM Matrix multiplication', isWasm: true, file: wasmO2Path,  method: 'matrixMul'},
  { testLabel: 'JS Matrix multiplication', isWasm: false, script: 'matrix-mul.js',  method: 'matrixMul'},
];
