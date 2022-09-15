const path = require('path');
const wasmO2Path = path.join(__dirname, '..', 'wasm', 'matrix-detO3.wasm')

exports.testSuites = [
  { testLabel: 'WASM Matrix determinant', isWasm: true, file: wasmO2Path,  method: 'matrixDet'},
  { testLabel: 'JS Matrix determinant', isWasm: false, script: 'matrix-det.js',  method: 'matrixDet'},
];
