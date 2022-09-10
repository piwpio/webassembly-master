const { parentPort } = require('worker_threads')

parentPort.on("message", msg => {
  const t = require('./test');
  t.test(msg).then(results => {
    sendResults(results.memory, results.performance, results.testIndex, results.testLabel);
  })
});

parentPort.postMessage({ event: 'ready' });

function sendResults(memoryUsage, performance, testIndex, testLabel) {
  parentPort.postMessage({
    event: 'results',
    data: {
      testIndex: testIndex,
      testLabel: testLabel,
      memory: memoryUsage,
      performance: performance
    }
  });
}

function sendMemoryUsage() {
  parentPort.postMessage({
    event: 'memoryUsage',
    data: process.memoryUsage()
  });
}
