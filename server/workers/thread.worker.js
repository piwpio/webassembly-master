const { parentPort } = require('worker_threads')
const t = require('./test');

parentPort.on("message", msg => {
  t.test(msg).then(results => {
    sendResults(results);
  });
});

parentPort.postMessage({ event: 'ready' });

function sendResults(results) {
  console.log('WORKER THREAD RESULTS');
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
