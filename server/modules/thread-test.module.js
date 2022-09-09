const { Worker } = require('worker_threads')
const {min} = require('mathjs');
const path = require('path');
const numCPUs = require('os').cpus().length;

const WORKERS = [];
const ACTIVE_WORKERS = {};
let WORKER_TEST_SUITE_INDEX = 0;
let RESULTS = [];
let IS_READY = true;
let TEST_TYPE = null;
let TEST_SUITES = null;
let TEST_DATA = null;
let TEST_REPEAT_TIMES = null;
let MAIN_SOCKET = null;

function run(testType, testSuites, testData, testRepeatTimes) {
  if (!IS_READY) {
    return;
  }
  IS_READY = false;
  TEST_TYPE = testType;
  TEST_SUITES = testSuites;
  TEST_DATA = testData;
  TEST_REPEAT_TIMES = testRepeatTimes;
  WORKER_TEST_SUITE_INDEX = 0;
  RESULTS = [];

  // for (let i = 0; i < min(numCPUs, TEST_SUITES.length); i++) {
  for (let i = 0; i < min(1, TEST_SUITES.length); i++) {
    addNewWorker();
  }
}

// ########################### WORKERS

function addNewWorker() {
  const workerPath = path.join(__dirname, '..', 'workers', 'thread.worker.js')
  const worker = new Worker(workerPath);
  ACTIVE_WORKERS[worker.threadId] = worker;

  worker.on('message', msg => {
    if (msg.event === 'ready') {
      const workerTestSuite = getTestSuiteForWorker();
      orReadyMessage(worker, workerTestSuite)
    } else if (msg.event === 'results') {
      onResultsMessage(worker, msg.data);
    } else if (msg.event === 'memoryUsage') {
      onMemoryUsage(worker, msg.data);
    }
  });
  worker.on('error', error => {
    // onError(error)
    console.log('WORKER ERROR');
    // console.log(error);
  });
  worker.on('exit', (code) => {
    console.log('WORKER EXIT CODE ', code);
    // onExit(code)
    // if (code !== 0)
    //   reject(new Error(`stopped with  ${code} exit code`));
  })

  // console.log(Object.keys(ACTIVE_WORKERS).length, worker.id, 'ACTIVE_WORKERS added')
}

function terminateWorker(worker) {
  return new Promise((resolve, _reject) => {
    const threadId = worker.threadId;
    // console.log('worker ' + worker.threadId + ' terminated');
    worker.terminate();
    setTimeout(() => {
      delete ACTIVE_WORKERS[threadId];
      resolve();
    }, 1000);
  })
}

// ########################### MESSAGE CALLBACKS

function orReadyMessage(worker, testSuite) {
  worker.postMessage({
    event: 'runTest',
    data: {
      testType: TEST_TYPE,
      testSuite: testSuite,
      testData: TEST_DATA,
      testRepeatTimes: TEST_REPEAT_TIMES
    }
  });
}

function onResultsMessage(worker, data) {
  prepareResults(data);
  terminateWorker(worker).then(() => {
    if (isAnyTestWaiting(TEST_SUITES)) {
      addNewWorker();
    } else if (Object.keys(ACTIVE_WORKERS).length === 0) {
      clean().then(() => sendSocketWithBackendReady())
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

function onExit(code) {
  console.log(code);
}

function onError(error) {
  console.log(error);
}

// ########################### HELPERS

function prepareResults(data) {
  if (Array.isArray(data.performance)) {
    const p = data.performance;
    const m = data.memory.map(mem => mem.rss / 1024 / 1024);

    RESULTS[data.testIndex] = {
      testIndex: data.testIndex,
      testLabel: data.testLabel,
      performance: p,
      memory: m
    }
  } else {
    const p = data.performance;
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
}

function getTestSuiteForWorker() {
  return TEST_SUITES.shift();
}

function isAnyTestWaiting() {
  return TEST_SUITES.length > 0;
}

function clean() {
  return new Promise((resolve) => {
    const workersToClean = Object.entries(WORKERS)
    if (!workersToClean.length) {
      resolve();
      return;
    }

    const workersLength = workersToClean.length;
    let workersTerminated = 0;
    for (let [_workerId, worker] of workersToClean) {
      terminateWorker(worker).then(() => {
        ++workersTerminated;
        if (workersLength === workersTerminated) {
          resolve();
        }
      })
    }
  })
}

// ########################### SOCKET COMUNICATION WITH FRONTEND

function setSocket(socket) {
  MAIN_SOCKET = socket;
}
function sendSocketWithBackendReady() {
  // console.log(RESULTS);
  console.log('###############################');
  IS_READY = true;

  const socketMsg = {
    event: 'status',
    data: getTestWorkerStatus()
  }
  MAIN_SOCKET.emit('msg', socketMsg);
}

function getTestWorkerStatus() {
  const status = {
    isReady: IS_READY,
  };
  if (RESULTS.length) {
    status['testType'] = TEST_TYPE;
    status['testResults'] = RESULTS
  }
  return status;
}

module.exports = {
  run,
  setSocket,
  getTestWorkerStatus
}
