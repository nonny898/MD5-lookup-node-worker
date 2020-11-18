const { Worker, isMainThread } = require('worker_threads');

const numWorkers = 8 // NOTE: can't set this to be more than 8 without fixing the way numbers are carried
const workers = []

if(isMainThread) {
  for (var i = 0; i < numWorkers; i++) {
    const worker = new Worker('./crack.js', { workerData: {
      workerId: i,
      maxPassLength: 5,
      passToCrack: "1b397f4bb45701be13c4ee9a2eebed54",
      performCrack: {
        start: i,
        hop: numWorkers
      }
    }});
    workers.push(worker)

    // run thread and pass info
    worker.on('message', (result) => {
      console.log(`Found password: ${result}`);
      workers.forEach(function(worker) {
        worker.terminate()
      })
    });
    worker.on('exit', (code) => {
      if (code !== 0)
      console.log('Worker stopped ' + code);
      else
      console.log('Worker stopped ' + code);
    });
  }
}