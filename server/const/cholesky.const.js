const path = require('path');
const wasmO2Path = path.join(__dirname, '..', 'wasm', 'choleskyO3.wasm')

exports.testSuites = [
  { testLabel: 'WASM Cholesky', isWasm: true, file: wasmO2Path,  method: 'cholesky'},
  { testLabel: 'JS Cholesky', isWasm: false, script: 'cholesky.js',  method: 'cholesky'},
];
