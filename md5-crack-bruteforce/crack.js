const { from, to, skip1_from, skip1_to, skip2_from, skip2_to } = require('./chars')
const hash = require('./md5');
const { workerData, parentPort } = require('worker_threads');

// Cracking settings
const workerId = workerData.workerId
const maxPassLength = workerData.maxPassLength
const passToCrack = workerData.passToCrack

function crack(options) {
  console.log("Started cracking")

  var hop = options.hop
  , length = 1
  , buf = new ArrayBuffer(maxPassLength)
  , bufView = new Uint8Array(buf)
  , view = bufView.subarray(maxPassLength - length)
  , numBefore, num, pw

  bufView[maxPassLength - 1] = from + options.start

  while (true) {
    pw = String.fromCharCode.apply(null, view)

    if (hash.md5(pw) == passToCrack) {
      return pw
    }

    numBefore = view[length - 1]
    num = (view[length - 1] += hop)

    // Skip over whole "skip ranges", like they don't exist
    if (numBefore < skip1_from && num >= skip1_from) {
      view[length - 1] = skip1_to + (num - skip1_from)

    } else if (numBefore < skip2_from && num >= skip2_from) {
      view[length - 1] = skip2_to + (num - skip2_from)
    }

    // Check if we need to carry any numbers
    // Check from right to left
    for (var i = length - 1; i >= 0; --i) {

      if (view[i] >= to) {
        // need to carry

        view[i] = (view[i] % to) + from

        if (i == 0) {
          // need to add a new "place" to the left

          length += 1
          view = bufView.subarray(maxPassLength - length)
          view[0] = from

          if (length > maxPassLength)
          return

        } else {
          // need to carry a number to the left "place"
          num = (view[i - 1] += 1)

          // Skip over whole "skip ranges" for everything but
          // the "ones place"
          if (num == skip1_from) {
            num = (view[i - 1] = skip1_to)
          }
          if (num == skip2_from) {
            num = (view[i - 1] = skip2_to)
          }
        }

      }
    }
  }

}

parentPort.postMessage(
  crack(workerData.performCrack)
);

