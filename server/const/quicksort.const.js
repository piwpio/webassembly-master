const path = require('path');
const wasmQuickSortO3Path = path.join(__dirname, '..', 'wasm', 'quicksortO3.wasm')

exports.testSuites = [
  { testLabel: 'WASM quicksort', isWasm: true, file: wasmQuickSortO3Path,  method: 'quicksort'},
  { testLabel: 'JS quicksort', isWasm: false, script: 'quicksort.js', method: 'quicksort'},
];
