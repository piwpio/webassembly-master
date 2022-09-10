const express = require('express');
const http = require('http');
const path = require('path');
const {shuffleArray} = require('../utils');

let MAIN_SOCKET = null;
let TEST_MODULE = null;

const startServer = (testModule) => {
  TEST_MODULE = testModule;

  const app = express();

  const clientPath = path.join(__dirname, '..', 'client')
  app.use(express.static(clientPath));
  app.get('*', (req, res) => res.sendFile(__dirname));

  const server = http.createServer(app);

  const port = 3000;
  server.listen(port, () => {
    console.log(`CLIENT LISTENING: http://localhost:${port}`)
  });

  const sio = require('socket.io')(server,{
    cors: {
      origin: '*',
    },
    maxHttpBufferSize: 1e9
  });


  sio.sockets.on('connection', socket =>  {
    MAIN_SOCKET = socket;
    TEST_MODULE.setSocket(MAIN_SOCKET);
    socket.on('msg', msg => {
      if (msg.event === 'status') {
        socketOnStatus();
      } else if (msg.event === 'newTest') {
        socketOnNewTest(msg.data);
        socketOnStatus(msg.data.testType);
      }
    });
  });
  console.log("SOCKETS LISTENING");
}

// ########################### SOCKET CALLBACKS

function socketOnStatus(testType) {
  const socketMsg = {
    event: 'status',
    data: getStatus()
  }
  if (testType) {
    socketMsg.data['testType'] = testType;
  }
  MAIN_SOCKET.emit('msg', socketMsg);
}

function socketOnNewTest(data) {
  const {testType, testSuites, clientData, repeatTimes} = getTestSuites(data);
  TEST_MODULE.run(testType, testSuites, clientData, repeatTimes);
}

// ########################### HELPERS

function getTestSuites(data) {
  const testType = data.testType;
  const clientData = data.clientData;
  const repeatTimes = data.repeatTimes ?? 1;
  const custom = data.custom ?? {};

  let originalSuites;
  if (testType === 'sort') {
    originalSuites = require('../const/sort.const').testSuites;
  }

  let testSuites = [];
  for (let i = 0; i < repeatTimes; i++) {
    testSuites = [...testSuites, ...originalSuites];
  }
  shuffleArray(testSuites);

  return {
    testType,
    testSuites: testSuites,
    clientData,
    repeatTimes,
  };
}

function getStatus() {
  return TEST_MODULE.getTestWorkerStatus();
}

module.exports = {
  startServer
}
