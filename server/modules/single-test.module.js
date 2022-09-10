const {test} = require('../workers/test');
const {prepareResults} = require('./module-utils');

let WORKER_TEST_SUITE_INDEX = 0;
let RESULTS = {};
let IS_READY = true;
let TEST_TYPE = null;
let TEST_SUITES = null;
let TEST_DATA = null;
let TEST_REPEAT_TIMES = null;
let MAIN_SOCKET = null;

async function run(testType, testSuites, testData, testRepeatTimes) {
  if (!IS_READY) {
    return;
  }
  IS_READY = false;
  TEST_TYPE = testType;
  TEST_SUITES = testSuites;
  TEST_DATA = testData;
  TEST_REPEAT_TIMES = testRepeatTimes;
  WORKER_TEST_SUITE_INDEX = 0;
  RESULTS = {};

  const testLength = testSuites.length;
  for (let i = 0; i < testLength; i++) {
    console.log(`PERFORMING TEST ${i + 1} OF ${testLength}`);

    const testSuite = getTestSuite();

    if (testSuite === undefined) {
      continue;
    }

    const msg = getMessage(testSuite);
    await test(msg).then(results => {
      onResults(results)
    });
    // global.gc();
  }

  sendSocketWithBackendReady();
}

// ########################### MESSAGE CALLBACKS

function getMessage(testSuite) {
  return {
    event: 'runTest',
    data: {
      testType: TEST_TYPE,
      testSuite: testSuite,
      testData: TEST_DATA,
      testRepeatTimes: TEST_REPEAT_TIMES
    }
  };
}

function onResults(data) {
  if (data) {
    prepareResults(RESULTS, data);
  }
}

// ########################### HELPERS

function getTestSuite() {
  return TEST_SUITES.shift();
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
  if (Object.keys(RESULTS).length) {
    status['testType'] = TEST_TYPE;
    status['testResults'] = RESULTS;
  }
  return status;
}

module.exports = {
  run,
  setSocket,
  getTestWorkerStatus
}
