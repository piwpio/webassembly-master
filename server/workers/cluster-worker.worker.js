const init = () => {
  process.on('message', function(msg) {
    const t = require('./test');
    t.test(msg).then(results => {
      sendResults(results.memory, results.performance, results.testIndex, results.testLabel);
    })
  });

  process.send({ event: 'ready' });
}

function sendResults(memoryUsage, performance, testIndex, testLabel) {
  process.send({
    event: 'results',
    data: {
      testIndex: testIndex,
      testLabel: testLabel,
      memory: memoryUsage,
      performance: performance
    }
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
