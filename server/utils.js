const generateSortFeed = (arraySize = 0, floats = true, max = 200_000_000) => {
  const feed = [];
  if (floats) {
    for (let i = 0; i < arraySize; i++) {
      feed.push(Math.random());
    }
  } else {
    for (let i = 0; i < arraySize; i++) {
      feed.push(Math.floor(Math.random() * max) + 1);
    }
  }
  return feed;
}

const memoryUsage = () => {
  const usage = process.memoryUsage();
  console.log('Process ' + process.pid + ', RSS: ' + bytesToSize(usage.rss, 3), 'and Heap:', bytesToSize(usage.heapUsed, 3), 'of', bytesToSize(usage.heapTotal, 3), 'total');
}

const unit = ['', 'K', 'M', 'G', 'T', 'P'];
function bytesToSize(input, precision)
{
  const index = Math.floor(Math.log(input) / Math.log(1024));
  if (unit >= unit.length) return input + ' B';
  return (input / Math.pow(1024, index)).toFixed(precision) + ' ' + unit[index] + 'B'
}

// The Fisher-Yates algorith
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function getPagesToGrow(memory, dataType, elements) {
  const bytesPerPage = 65536; //64 * 1024 bytes
  const baseMemory = memory.buffer.byteLength; // emscripten default bytesPerPage * 256, 16777216 bytes
  const dataMemory = dataType.BYTES_PER_ELEMENT * elements;
  return Math.ceil((dataMemory - baseMemory) / bytesPerPage);
}

exports.memoryUsage = memoryUsage;
exports.generateSortFeed = generateSortFeed;
exports.shuffleArray = shuffleArray;
exports.getPagesToGrow = getPagesToGrow;
