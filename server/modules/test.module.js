const cluster = require('cluster');
const {min} = require('mathjs');
const numCPUs = require('os').cpus().length;

const WORKERS = [];
const ACTIVE_WORKERS = {};
let WORKER_TEST_SUITE_INDEX = 0;
let RESULTS = [];
let IS_READY = true;
let NEXT_WORKER_TEST_SUITE = null;

const run = (testType, testSuites, testData) => {
  if (!IS_READY) {
    return;
  }
  WORKER_TEST_SUITE_INDEX = 0;
  RESULTS = [];
  IS_READY = false;

  // for (let i = 0; i < min(numCPUs, testSuites.length); i++) {
  for (let i = 0; i < min(1, testSuites.length); i++) {
    addNewWorker();
  }

  cluster.on('exit', function(worker, code, signal) {
    onExit(signal, code);
  });

  cluster.on('online', (worker) => {
    const workerTestSuite = NEXT_WORKER_TEST_SUITE ?? getTestSuiteForWorker(testSuites);

    worker.on('message', function (msg) {
      if (msg.event === 'ready') {
        orReadyMessage(worker, testType, workerTestSuite, testData)
      } else if (msg.event === 'results') {
        onResultsMessage(worker, msg.data, testSuites);
      } else if (msg.event === 'memoryUsage') {
        onMemoryUsage(worker, msg.data)
      }
    });
  });
}

// ########################### MESSAGE CALLBACKS

function orReadyMessage(worker, testType, testSuite, testData) {
  worker.send({
    event: 'runTest',
    data: {
      testType,
      testSuite,
      testData
    }
  });
}

function onResultsMessage(worker, data, testSuites) {
  prepareResults(data);
  killWorker(worker).then(() => {
    if (isAnyTestWaiting(testSuites)) {
      // console.log('%d TESTS WAITING', testSuites.length - WORKER_TEST_SUITE_INDEX)
      NEXT_WORKER_TEST_SUITE = getTestSuiteForWorker(testSuites);
      addNewWorker();
    } else if (Object.keys(ACTIVE_WORKERS).length === 0) {
      clean().then(() => {
        NEXT_WORKER_TEST_SUITE = null;
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

// ########################### HELPERS
function prepareResults(data) {
  const p = data.performance / 1000;
  const m = data.memory.rss / 1024 / 1024;

  if (RESULTS[data.testIndex] === undefined) {
    RESULTS[data.testIndex] = {
      testIndex: data.testIndex,
      testLabel: data.testLabel,
      performance: [p],
      memory: [m]
    }
  } else {
    RESULTS[data.testIndex].performance.push(p);
    RESULTS[data.testIndex].memory.push(m);
  }
}

function getTestSuiteForWorker(testSuites) {
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
  // console.log(RESULTS);
  IS_READY = true;
  // console.log('SEND SOCKET DATA');
  console.log('###########################');
}

function getTestWorkerStatus() {
  const status = {
    isReady: IS_READY,
  };
  if (IS_READY?.length) {
    status['testResults'] = RESULTS
  }
  return status;
}

module.exports = {
  run,
  getTestWorkerStatus
}
