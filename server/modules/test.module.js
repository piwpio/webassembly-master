const cluster = require('cluster');
const {min} = require('mathjs');
const numCPUs = require('os').cpus().length;
const _workers = []; //workerId => worker
let _workerTestSuiteIndex = 0;

const run = (testSuites, _testData) => {
  for (let i = 0; i < min(numCPUs, testSuites.length); i++) {
    _workers.push(cluster.fork());
  }

  cluster.on('exit', function(worker, _code, _signal) {
    console.log('worker ' + worker.process.pid + ' died');

  });

  cluster.on('online', (worker, _code, _signal) => {
    const workerTestData = getTestDataForWorker(testSuites)

    worker.on('message', function (msg) {
      if (msg.event === 'ready') {
        orReadyMessage(worker, workerTestData)
      } else if (msg.event === 'results') {
        onResultsMessage(worker, testSuites);
      } else if (msg.event === 'memoryUsage') {
        onMemoryUsage(worker, msg.data)
      }
    });
  });
}

function orReadyMessage(worker, workerTestData) {
  worker.send({
    event: 'runTest',
    data: workerTestData
  });
}

function onResultsMessage(worker, testSuites) {
  killWorker(worker).then(() => {
    if (checkIfAnyTestWaiting(testSuites)) {
      console.log('%d tests waiting', testSuites.length - _workerTestSuiteIndex)
      _workers.push(cluster.fork());
    }
  })
}

function onMemoryUsage(worker, data) {
  console.log("Worker with ID: %d consumes %imb of memory", worker.id, data.rss / 1024 / 1024);
}

function getTestDataForWorker(testSuites) {
  return testSuites[_workerTestSuiteIndex++];
}

function checkIfAnyTestWaiting(testSuites) {
  return testSuites.length >  _workerTestSuiteIndex;
}

function clean() {
  for (let worker of _workers) {
    killWorker(worker).then()
  }
}

// Because long living server connections may block workers from disconnecting, it may be useful to send a message,
// so application specific actions may be taken to close them. It also may be useful to implement a timeout,
// killing a worker if the 'disconnect' event has not been emitted after some time.
function killWorker(worker) {
  return new Promise((resolve, _reject) => {
    worker.disconnect()
    setTimeout(() => {
        worker.kill()
        resolve()
    }, 2000);
  })
}

module.exports = {
  run,
  clean
}
