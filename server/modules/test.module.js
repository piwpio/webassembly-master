const cluster = require('cluster');
const {min} = require('mathjs');
const numCPUs = require('os').cpus().length;
const WORKERS = [];
const ACTIVE_WORKERS = {};
let WORKER_TEST_SUITE_INDEX = 0;

const run = (testSuites, _testData) => {
  WORKER_TEST_SUITE_INDEX = 0;

  // for (let i = 0; i < min(numCPUs, testSuites.length); i++) {
  for (let i = 0; i < 2; i++) {
    WORKERS.push(cluster.fork());
  }

  cluster.on('exit', function(worker, code, signal) {
    onExit(signal, code);
  });

  cluster.on('online', (worker, _code, _signal) => {
    ACTIVE_WORKERS[worker.id] = worker;
    console.log(Object.keys(ACTIVE_WORKERS).length, worker.id, 'ACTIVE_WORKERS added')

    if (isDataOutOfRange(testSuites)) {
      killWorker(worker).then(() => {
        delete ACTIVE_WORKERS[worker.id];
        console.log(Object.keys(ACTIVE_WORKERS).length, worker.id, 'ACTIVE_WORKERS killed')
      });
      return;
    }

    const workerTestData = getTestDataForWorker(testSuites);

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
    delete ACTIVE_WORKERS[worker.id];
    console.log(Object.keys(ACTIVE_WORKERS).length, worker.id, 'ACTIVE_WORKERS killed')
    if (isAnyTestWaiting(testSuites)) {
      console.log('%d TESTS WAITING', testSuites.length - WORKER_TEST_SUITE_INDEX)
      WORKERS.push(cluster.fork());
    } else if (Object.keys(ACTIVE_WORKERS).length === 0) {
      clean().then(() => {
        sendSocketWithBackendReady();
      })
    }
  });
}

function onMemoryUsage(worker, data) {
  // console.log("Worker with ID: %d consumes %imb of memory", worker.id, data.rss / 1024 / 1024);
}

function onExit(signal, code) {
  if (signal) {
    // console.log(`worker was killed by signal: ${signal}`);
  } else if (code !== 0) {
    console.log(`worker exited with error code: ${code}`);
    clean().then(() => {
      sendSocketWithBackendReady();
    })
  } else {
    // console.log('worker success!');
  }
}

function sendSocketWithBackendReady() {
  console.log('socket clear and ready callback');
}

function getTestDataForWorker(testSuites) {
  return testSuites[WORKER_TEST_SUITE_INDEX++];
}

function isAnyTestWaiting(testSuites) {
  return testSuites.length > WORKER_TEST_SUITE_INDEX;
}

function isDataOutOfRange(testSuites) {
  return testSuites[WORKER_TEST_SUITE_INDEX] === undefined;
}

function clean() {
  return new Promise((resolve, _reject) => {
    const workersToClean = Object.entries(WORKERS)
    const workersLength = workersToClean.length;
    let workersKilled = 0;
    for (let [_workerId, worker] of workersToClean) {
      killWorker(worker).then(() => {
        ++workersKilled;
        if (workersLength === workersKilled) {
          resolve();
        }
      })
    }
  })
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
