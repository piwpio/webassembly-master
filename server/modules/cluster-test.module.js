const cluster = require('cluster');
const {min} = require('mathjs');
const numCPUs = require('os').cpus().length;
const {prepareResults} = require('./module-utils');

const WORKERS = [];
const ACTIVE_WORKERS = {};
let RESULTS = [];
let IS_READY = true;
let TEST_TYPE = null;
let TEST_SUITES = null;
let TEST_DATA = null;
let TEST_REPEAT_TIMES = null;
let MAIN_SOCKET = null;
let TEST_LENGTH = null;

function run(testType, testSuites, testData, testRepeatTimes) {
  if (!IS_READY) {
    return;
  }
  IS_READY = false;
  TEST_TYPE = testType;
  TEST_SUITES = testSuites;
  TEST_DATA = testData;
  TEST_REPEAT_TIMES = testRepeatTimes;
  RESULTS = [];
  TEST_LENGTH = testSuites.length;

  for (let i = 0; i < min(numCPUs, TEST_LENGTH.length); i++) {
  // for (let i = 0; i < min(1, TEST_LENGTH.length); i++) {
    addNewWorker();
  }
}

// ########################### WORKERS

function addNewWorker() {
  const worker = cluster.fork();
  ACTIVE_WORKERS[worker.id] = worker;
  worker.on('online', ()=> {
    const workerTestSuite = getTestSuiteForWorker();

    if (workerTestSuite === undefined) {
      onResultsMessage(worker)
      return;
    }
    console.log(`PERFORMING TEST ${TEST_LENGTH - TEST_SUITES.length} OF ${TEST_LENGTH}`);

    worker.on('message', function (msg) {
      if (msg.event === 'ready') {
        orReadyMessage(worker, workerTestSuite)
      } else if (msg.event === 'results') {
        onResultsMessage(worker, msg.data);
      } else if (msg.event === 'memoryUsage') {
        onMemoryUsage(worker, msg.data)
      }
    });
  })

  worker.on('exit', function(code, signal) {
    // onExit(signal, code);
  });
}

function killWorker(worker) {
  return new Promise((resolve, _reject) => {
    worker.disconnect()
    setTimeout(() => {
      delete ACTIVE_WORKERS[worker.id];
      resolve();
    }, 1000);
  })
}

// ########################### MESSAGE CALLBACKS

function orReadyMessage(worker, testSuite) {
  worker.send({
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
  if (data) {
    prepareResults(RESULTS, data);
  }
  killWorker(worker).then(() => {
    if (isAnyTestWaiting()) {
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

function onExit(signal, code) {
  if (signal) {
    console.log(`worker was killed by signal: ${signal}`);
  } else if (code !== 0) {
    console.log(`worker exited with error code: ${code}`);
  } else {
    console.log('worker success!');
  }
}

// ########################### HELPERS

function getTestSuiteForWorker() {
  return TEST_SUITES.shift();
}

function isAnyTestWaiting() {
  return TEST_SUITES.length > 0;
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
