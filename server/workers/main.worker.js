const express = require('express');
const http = require('http');
const path = require('path');

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
}

module.exports = {
  startServer
}
