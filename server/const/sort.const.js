const path = require('path');
const wasmSortPath = path.join(__dirname, '..', 'wasm', 'sort.wasm')
const wasmQuickSortO1Path = path.join(__dirname, '..', 'wasm', 'quicksortO1.wasm')
const wasmQuickSortO3Path = path.join(__dirname, '..', 'wasm', 'quicksortO3.wasm')
const wasmQuickSortOzPath = path.join(__dirname, '..', 'wasm', 'quicksortOz.wasm')

exports.testSuites = [
  // { testLabel: 'WASM std::sort', isWasm: true, file: wasmSortPath,  method: 'sort'},
  { testLabel: 'WASM QuickSort -O1', isWasm: true, file: wasmQuickSortO1Path,  method: 'quickSort'},
  { testLabel: 'WASM QuickSort -O3', isWasm: true, file: wasmQuickSortO3Path,  method: 'quickSort'},
  { testLabel: 'WASM QuickSort -Oz', isWasm: true, file: wasmQuickSortO3Path,  method: 'quickSort'},
  { testLabel: 'JS QuickSort', isWasm: false, script: 'sort.js', method: 'jsQuickSort'},
  // { testLabel: 'JS Native', isWasm: false, script: 'sort.js', method: 'jsSort'},
  // { testLabel: 'JS Math.js', isWasm: false, script: 'sort.js', method: 'jsSortMath'},
];
