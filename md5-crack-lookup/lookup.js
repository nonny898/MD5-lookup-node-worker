const { workerData, parentPort } = require('worker_threads');
const { performance } = require('perf_hooks');

function crack(workerData) {
  console.log(`Start looking from thread number ${workerData.workerId}`)
  const newArray = workerData.arrayToFind.map((password) => {
    if (password.split(" ")[0] === workerData.passToCrack) passwordFound = password.split(" ")[1]
    return password.split(" ")[0] === workerData.passToCrack
  })
  if (newArray.includes(true)) { return {found: true, password: passwordFound, end: performance.now()}}
  else {return {found: false, password: "Not in database.", end: performance.now()}}
}

parentPort.postMessage( crack(workerData) );

