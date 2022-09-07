const path = require('path');
const wasmSortPath = path.join(__dirname, '..', 'wasm', 'sort.wasm')

exports.test = [
  { isWasm: true, file: wasmSortPath,  method: 'sort'},
  { isWasm: true, file: wasmSortPath,  method: 'quickSort'},
  { isWasm: false, script: 'sort.js', method: 'jsQuickSort'},
  { isWasm: false, script: 'sort.js', method: 'jsSort'},
  { isWasm: false, script: 'sort.js', method: 'jsSortMath'}
]
