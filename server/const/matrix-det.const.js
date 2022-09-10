const path = require('path');
const wasmO2Path = path.join(__dirname, '..', 'wasm', 'matrix-detO2.wasm')

exports.testSuites = [
  { testLabel: 'WASM Matrix determinant', isWasm: true, file: wasmO2Path,  method: 'gaussElimination'},
  // { testLabel: 'JS Math.js', isWasm: false, script: 'sort.js', method: 'jsSortMath'},
];
