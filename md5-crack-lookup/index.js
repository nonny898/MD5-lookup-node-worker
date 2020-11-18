const { Worker, isMainThread } = require('worker_threads');
const { performance } = require('perf_hooks');
const fs = require('fs');
const hashList = fs.readFileSync('hashed.txt').toString().split("\r\n");

const numWorkers = 8 // NOTE: can't set this to be more than 8 without fixing the way numbers are carried
const workers = []
const hashedListSize = 14343472
const startingPoint = {
  0: 0,
  1: 100,
  2: 200,
  3: 300,
  4: 400,
  5: 500,
  6: 600,
  7: 700,
}

if(isMainThread) {
  var t0 = performance.now()
  for (var i = 0; i < numWorkers; i++) {
    const worker = new Worker('./lookup.js', { workerData: {
      workerId: i,
      startingPoint: startingPoint[i],
      hashList,
      hashedListSize,
      passToCrack: "01c4c3d0bad89532e188d94265e36a71",
    }});
    workers.push(worker)
    // run thread and pass info
    worker.on('message', (result) => {
      if (result.found){
        const t1 = result.t1
        console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
        console.log(`Found password: ${result.password}`)
        workers.forEach(function(worker) {
          worker.terminate()
        })
      } else {
        console.log(result.head)
      }
    });
    worker.on('exit', (code) => {
      if (code !== 0)
      console.log('Worker stopped ' + code);
      else
      console.log('Worker stopped ' + code);
    });
  }
}