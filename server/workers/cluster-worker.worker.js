const init = () => {
  process.on('message', function(msg) {
    const t = require('./test');
    t.test(msg).then(results => sendResults(results));
  });

  process.send({ event: 'ready' });
}

function sendResults(results) {
  process.send({
    event: 'results',
    data: results
  });
}

function sendMemoryUsage() {
  process.send({
    event: 'memoryUsage',
    data: process.memoryUsage()
  });
}

module.exports = {
  init
}
