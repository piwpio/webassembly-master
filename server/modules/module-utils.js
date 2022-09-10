const prepareResults = (RESULTS, dataToAdd) => {
  const p = dataToAdd.performance;
  // const m = (dataToAdd.memory[1].heapUsed - dataToAdd.memory[0].heapUsed) / 1024 / 1024;
  const m = dataToAdd.memory[0].rss / 1024 / 1024;
  if (RESULTS[dataToAdd.testIndex] === undefined) {
    RESULTS[dataToAdd.testIndex] = {
      testIndex: dataToAdd.testIndex,
      testLabel: dataToAdd.testLabel,
      performance: [p],
      memory: [m],
      results: dataToAdd.results,
    }
  } else {
    RESULTS[dataToAdd.testIndex].performance.push(p);
    RESULTS[dataToAdd.testIndex].memory.push(m);
  }
}

exports.prepareResults = prepareResults;
