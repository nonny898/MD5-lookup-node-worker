const { Worker } = require('worker_threads');
const { performance } = require('perf_hooks');
const { getHash } = require('./getHash')

const fromText = getHash()
const hashList = fromText.lines
const hashedListSize = fromText.counter
const passToCrack = "ad849a20dc8677403d4789595bd66877"

const createWorker = (arrayToFind,i) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./lookup.js', { workerData: {
      workerId: i,
      arrayToFind,
      passToCrack,
    }});
    worker.on("message", resolve);
    worker.on("error", reject);
  });
};

async function splitHash(workers) {
  const segmentsPerWorker = Math.round(hashedListSize / workers);
  const promises = Array(workers).fill().map((_,index) => {
      let arrayToFind;
      if (index === 0) {
        // the first segment
        arrayToFind = hashList.slice(0, segmentsPerWorker);
      } else if (index === workers - 1) {
        // the last segment
        arrayToFind = hashList.slice(segmentsPerWorker * index);
      } else {
        // intermediate segments
        arrayToFind = hashList.slice(segmentsPerWorker * index,segmentsPerWorker * (index + 1))
      }
      return createWorker(arrayToFind,index)
  });
  const segmentsResults = await Promise.all(promises);
  const getWorkerIfFound = segmentsResults.filter(result => result.found === true)
  if (getWorkerIfFound.length < 1) {
    return segmentsResults[workers - 1]
  } else {
    return getWorkerIfFound[0];
  }
}

async function run() {

  // lookup with one workers
  // const start1 = performance.now();
  // const result1 = await splitHash(1);
  // console.log(
  //   `Password = ${result1[0].password.split('\r')[0]} found in ${result1[0].end - start1}ms`
  // );

  // lookup with multiple workers
  const start3 = performance.now();
  const result3 = await splitHash(8);
  console.log(
    `Password = ${result3.password.split('\r')[0]}\nFound in ${result3.end - start3}ms.`
  );
  console.log("\nDone");
}

run();