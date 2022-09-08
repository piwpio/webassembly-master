const express = require('express');
const http = require('http');
const path = require('path');
const {run, getTestWorkerStatus} = require('../modules/test.module');

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
    }
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

function socketOnNewTest() {
  const testData = getTestData()
  // run()
}

// ########################### HELPERS

function getTestData(data) {
  const clientData = data.clientData;
  const test = data.test;
  console.log(test, clientData);

  return [];
}

function getStatus() {
  return getTestWorkerStatus();
}

module.exports = {
  startServer
}
