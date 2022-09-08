const cluster = require('cluster');

if (cluster.isPrimary) {
  const mainWorker = require('./workers/main.worker.js')
  mainWorker.startServer();
} else {
  const worker = require('./workers/worker.worker')
  worker.init();
}

// TODO report to nodeJs - multiple online events for single worker
// cluster.on('exit', function(worker, code, signal) {
//   console.log(cluster.workers);
//   console.log('worker ' + worker.process.pid + ' died');
//   // onExit(signal, code);
// });
//
// cluster.on('online', (worker) => {
//   console.log(Object.keys(cluster.workers));
//   console.log('WORKER IS ONLINE', worker.id);
//
//   setTimeout(() => {
//     killWorker(worker).then(() => IS_READY = true)
//   }, 2000)
//
//   // const workerTestSuite = NEXT_WORKER_TEST_SUITE ?? getTestSuiteForWorker(testSuites);
//   // worker.on('message', function (msg) {
//   //   if (msg.event === 'ready') {
//   //     orReadyMessage(worker, testType, workerTestSuite, testData)
//   //   } else if (msg.event === 'results') {
//   //     onResultsMessage(worker, msg.data, testSuites);
//   //   } else if (msg.event === 'memoryUsage') {
//   //     onMemoryUsage(worker, msg.data)
//   //   }
//   // });
// });
