const express = require('express');
const http = require('http');
const path = require('path');
const testModule = require('../modules/test.module');

const startServer = () => {
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
    socket.on('msg', msg => {
      if (msg.event === 'status') {
        socketOnStatus(socket);
      } else if (msg.event === 'newTest') {
        socketOnNewTest(msg.data)
      }

    });
  });
  console.log("SOCKETS LISTENING");
}

// ########################### SOCKET CALLBACKS

function socketOnStatus(socket) {
  const socketMsg = {
    event: 'status',
    data: getStatus()
  }
  socket.emit('msg', socketMsg);
}

function socketOnNewTest(data) {
  const {testType, testSuites, clientData} = getTestSuites(data);
  testModule.run(testType, testSuites, clientData);
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

  return {
    testType,
    testSuites,
    clientData
  };
}

function getStatus() {
  return testModule.getTestWorkerStatus();
}

module.exports = {
  startServer
}
