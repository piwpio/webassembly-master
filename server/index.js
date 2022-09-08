const cluster = require('cluster');

if (cluster.isMaster) {
  const mainWorker = require('./workers/main.worker.js')
  mainWorker.startServer();
} else {
  const worker = require('./workers/worker.worker')
  worker.init();
}


// const numCPUs = cpus().length;
// if (cluster.isMaster) {
//   for (let i = 0; i < 1; i++) {
//     cluster.fork();
//   }
//   cluster.on('exit', function(worker, code, signal) {
//     console.log('worker ' + worker.process.pid + ' died');
//   });
//   cluster.on('online', (worker, code, signal) => {
//     worker.on('message', function(dd) {
//       if (dd.event === 'memoryUsage') {
//         console.log("Worker with ID: %d consumes %imb of memory", worker.id, dd.data.heapTotal / 1024 / 1024);
//       }
//     });
//
//   });
//   console.log("Master consumes %imb of memory", process.memoryUsage().heapTotal / 1024 / 1024);
// } else {
//   // if (cluster.worker.id === 1) {
//   process.send({
//     event: 'memoryUsage',
//     data: process.memoryUsage()
//   });
//
//   // tutaj obliczenia
//
//   process.send({
//     event: 'memoryUsage',
//     data: process.memoryUsage()
//   });
// }



