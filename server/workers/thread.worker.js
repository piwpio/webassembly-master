const { parentPort } = require('worker_threads')

parentPort.on("message", msg => {
  const t = require('./test');
  t.test(msg).then(results => sendResults(results));
});

parentPort.postMessage({ event: 'ready' });

function sendResults(results) {
  parentPort.postMessage({
    event: 'results',
    data: results
  });
}

function sendMemoryUsage() {
  parentPort.postMessage({
    event: 'memoryUsage',
    data: process.memoryUsage()
  });
}
