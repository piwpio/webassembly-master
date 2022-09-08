const path = require('path');
const wasmSortPath = path.join(__dirname, '..', 'wasm', 'sort.wasm')

exports.testSuites = [
  // { testIndex: 0, testLabel: 'WASM std::sort', isWasm: true, file: wasmSortPath,  method: 'sort'},
  { testIndex: 1, testLabel: 'WASM QuickSort', isWasm: true, file: wasmSortPath,  method: 'quickSort'},
  { testIndex: 2, testLabel: 'JS QuickSort', isWasm: false, script: 'sort.js', method: 'jsQuickSort'},
  // { testIndex: 3, testLabel: 'JS Native', isWasm: false, script: 'sort.js', method: 'jsSort'},
  // { testIndex: 4, testLabel: 'JS Math.js', isWasm: false, script: 'sort.js', method: 'jsSortMath'},
]
