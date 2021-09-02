# porro

Porro is a simple and fast implementation of the leaky bucket algorithm.

## Naming things is hard

During a scene in _Cloudy with a Chance of Meatballs 2_, the protagonists are moving with a boat. At some point, a wild tribe of living **leeks** attack the boat, and the scientist shouts _"There's a **leak** in the boat!"_. Porro means leek in Italian. Leaky bucket algorithm -> Leak -> Leek -> Porro.

## Features

- **No dependencies:** small footprint.
- **No timers:** unlike other implementations, Porro doesn't use any timer.
- **ES modules support:** Native Node.js `import`/`export`.
- **Common JS support:** common runtimes are still supported.
- **ES6:** code uses just ES6 features.

## Install

```
npm install porro
```

## Usage

```javascript
import { Porro } from 'porro'

const bucket = new Porro({
  bucketSize: 2, // 2 tokens max (the actual bucket size)
  interval: 1000, // ...every second (milliseconds)
  tokensPerInterval: 2, // ...add 2 tokens inside the bucket
  queueSize: 10 // ...and permit 10 overflowing requests
})

// Reset original bucket status
bucket.reset()

function requestExample () {
  // Get the waiting time for the next request
  const ms = bucket.request()

  setTimeout(() => {
    doStuff()
  }, ms)
}

async function throttleExample () {
  // Wait the correct time before running the next request
  await bucket.throttle()

  doStuff()
}
```
