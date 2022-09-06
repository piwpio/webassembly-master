const express = require("express");
const app = express();
const http = require("http");

app.use(express.static(__dirname + '/client'));
app.get('*', (req, res) => res.sendFile(__dirname));

const server = http.createServer(app);

const port = 3000;
server.listen(port, () => {
  console.log(`CLIENT LISTENING: http://localhost:${port}`)
});
