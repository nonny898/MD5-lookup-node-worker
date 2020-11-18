const { workerData, parentPort } = require('worker_threads');
const { performance } = require('perf_hooks');

function crack(workerData) {
  console.log("Start looking...")
  // const newArray = workerData.hashList.map((password) => {
  //   if (password.split(" ")[0] === workerData.passToCrack) passwordFound = password.split(" ")[1]
  //   return password.split(" ")[0] === workerData.passToCrack
  // })
  // if (newArray.includes(true)) { return {found: true, password: passwordFound, t1: performance.now()}}
  // else {return {found: false, password: "Not in database."}}
  let head = workerData.startingPoint
  let passwordFound = ""
  while ((head + 100) < workerData.hashedListSize+1) {
    const newArray = workerData.hashList.slice(head,head+100).map((password) => {
      if (password.split(" ")[0] === workerData.passToCrack) passwordFound = password.split(" ")[1]
      return password.split(" ")[0] === workerData.passToCrack
    })
    if (newArray.includes(true)) { return {found: true, password: passwordFound, t1: performance.now()}}
    else {
      head += 800
    }
  }
  return {found: false, password: "Not in database.", head}
}

parentPort.postMessage(
  crack(workerData)
  );

