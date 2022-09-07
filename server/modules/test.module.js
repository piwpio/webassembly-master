const cluster = require('cluster');
const {min} = require('mathjs');
const numCPUs = require('os').cpus().length;

const WORKERS = [];
const ACTIVE_WORKERS = {};
let WORKER_TEST_SUITE_INDEX = 0;
let nextWorkerData = null;

const run = (testSuites, _testData) => {
  WORKER_TEST_SUITE_INDEX = 0;

  for (let i = 0; i < min(numCPUs, testSuites.length); i++) {
    addNewWorker();
  }

  cluster.on('exit', function(worker, code, signal) {
    onExit(signal, code);
  });

  cluster.on('online', (worker, _code, _signal) => {
    const workerTestData = nextWorkerData ?? getTestDataForWorker(testSuites);

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

// ########################### MESSAGE CALLBACKS

function orReadyMessage(worker, workerTestData) {
  worker.send({
    event: 'runTest',
    data: workerTestData
  });
}

function onResultsMessage(worker, testSuites) {
  killWorker(worker).then(() => {
    if (isAnyTestWaiting(testSuites)) {
      // console.log('%d TESTS WAITING', testSuites.length - WORKER_TEST_SUITE_INDEX)
      nextWorkerData = getTestDataForWorker(testSuites);
      addNewWorker();
    } else if (Object.keys(ACTIVE_WORKERS).length === 0) {
      clean().then(() => {
        nextWorkerData = null;
        sendSocketWithBackendReady();
      })
    }
  });
}

function onMemoryUsage(worker, data) {
  console.log("Worker with ID: %d consumes %imb of rss", worker.id, data.rss / 1024 / 1024);
  console.log("Worker with ID: %d consumes %imb of heapTotal", worker.id, data.heapTotal / 1024 / 1024);
  console.log("Worker with ID: %d consumes %imb of heapUsed", worker.id, data.heapUsed / 1024 / 1024);
  console.log("Worker with ID: %d consumes %imb of external", worker.id, data.external / 1024 / 1024);
  console.log("Worker with ID: %d consumes %imb of arrayBuffers", worker.id, data.arrayBuffers / 1024 / 1024);
  console.log("-----------");
}

// ########################### WORKERS

function addNewWorker() {
  const worker = cluster.fork();
  ACTIVE_WORKERS[worker.id] = worker;
  // console.log(Object.keys(ACTIVE_WORKERS).length, worker.id, 'ACTIVE_WORKERS added')
}

function killWorker(worker) {
  return new Promise((resolve, _reject) => {
    worker.disconnect()
    setTimeout(() => {
      worker.kill();
      delete ACTIVE_WORKERS[worker.id];
      // console.log(Object.keys(ACTIVE_WORKERS).length, worker.id, 'ACTIVE_WORKERS killed')
      resolve()
    }, 2000);
  })
}

function onExit(signal, code) {
  if (signal) {
    // console.log(`worker was killed by signal: ${signal}`);
  } else if (code !== 0) {
    // console.log(`worker exited with error code: ${code}`);
    // clean().then(() => {
    //   sendSocketWithBackendReady();
    // })
  } else {
    // console.log('worker success!');
  }
}

// ########################### HELPERS

function getTestDataForWorker(testSuites) {
  return testSuites[WORKER_TEST_SUITE_INDEX++];
}

function isAnyTestWaiting(testSuites) {
  return testSuites.length > WORKER_TEST_SUITE_INDEX;
}

function clean() {
  return new Promise((resolve, _reject) => {
    const workersToClean = Object.entries(WORKERS)
    if (!workersToClean.length) {
      resolve();
      return;
    }

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

// ########################### SOCKET COMUNICATION WITH FRONTEND

function sendSocketWithBackendReady() {
  console.log('socket clear and ready callback');
}

module.exports = {
  run,
  clean
}
