const prepareResults = (RESULTS, dataToAdd) => {
  if (RESULTS.visualization === undefined && dataToAdd?.visualization) {
    RESULTS.visualization = dataToAdd.visualization;
  }

  if (RESULTS.results === undefined) {
    RESULTS.results = [];
  }

  const p = dataToAdd.performance;
  // const m = (dataToAdd.memory[1].heapUsed - dataToAdd.memory[0].heapUsed) / 1024 / 1024;
  const m = (dataToAdd.memory[0].rss / 1024 / 1024) + (dataToAdd.memory[0].external / 1024 / 1024);
  if (RESULTS.results[dataToAdd.testIndex] === undefined) {
    RESULTS.results[dataToAdd.testIndex] = {
      testIndex: dataToAdd.testIndex,
      testLabel: dataToAdd.testLabel,
      performance: [p],
      memory: [m],
    }
  } else {
    RESULTS.results[dataToAdd.testIndex].performance.push(p);
    RESULTS.results[dataToAdd.testIndex].memory.push(m);
  }
}

exports.prepareResults = prepareResults;
