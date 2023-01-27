[![npm version](https://badge.fury.io/js/porro.svg)](https://badge.fury.io/js/porro)
[![ci](https://github.com/greguz/porro/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/greguz/porro/actions/workflows/ci.yaml)
[![Coverage Status](https://coveralls.io/repos/github/greguz/porro/badge.svg?branch=master)](https://coveralls.io/github/greguz/porro?branch=master)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Porro is a simple and fast implementation of the leaky bucket algorithm.

## Naming things is hard

During a scene in _Cloudy with a Chance of Meatballs 2_, the protagonists are moving with a boat. At some point, a wild tribe of living **leeks** attacks the boat, and the scientist shouts: _"There's a **leak** in the boat!"_. Porro means leek in Italian. Leaky bucket algorithm -> Leak -> Leek -> Porro.

## Features

- **No dependencies:** small footprint.
- **No timers:** unlike some other implementations, Porro doesn't use any timer.
- **ES modules support:** native Node.js `import`/`export`.
- **CommonJS support:** common runtimes are still supported.
- **ES6:** code just uses ES6 features.
- **TypeScript:** this package includes its own TypeScript declarations.

## Install

Open your favourite shell and run:

```
npm install porro
```

## API

### `new Porro(options)`

Porro's `constructor`.

- `options` `<Object>`
  - bucketSize `<Number>` The size (number of tokens) of the bucket.
  - interval `<Number>` Time interval in milliseconds to refill the bucket.
  - tokensPerInterval `<Number>` Number of refilled tokens after the specified interval.
- Returns: `<Porro>`

### `Porro::request([quantity])`

Returns the amount of time that the pending request needs to wait before executing.

- `[quantity]` `<Number>` Number (positive integer) of tokens to burn for the current request. Defaults to `1`.
- Returns: `<Number>`

### `Porro::throttle([quantity])`

Returns a `Promise` that will resolve when It's appropriate to execute the pending request.

- `[quantity]` `<Number>` Number (positive integer) of tokens to burn for the current request. Defaults to `1`.
- Returns: `<Promise>`

### `Porro::reset()`

Resets the bucket to its original status.

## Example

```javascript
import { Porro } from 'porro'

// 2 requests per second with a "buffer" of 5 requests
const bucket = new Porro({
  bucketSize: 5,
  interval: 1000,
  tokensPerInterval: 2
})

async function run () {
  // Create 10 "requests"
  const items = new Array(10).fill(null)

  // Execute all requests at the same time
  await Promise.all(items.map(doSomething))
}

async function doSomething (value, index) {
  // Get the correct waiting time
  const ms = bucket.request()

  console.log(`Request #${index} will wait ${ms}ms`)

  // Wait for your turn
  // You can also use `await bucket.throttle()` for simplicity
  if (ms > 0) {
    await sleep(ms)
  }

  console.log(`Run request #${index} at ${new Date().toISOString()}`)
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

run()
// Request #0 will wait 0ms
// Run request #0 at 2023-01-27T13:29:29.246Z
// Request #1 will wait 0ms
// Run request #1 at 2023-01-27T13:29:29.246Z
// Request #2 will wait 0ms
// Run request #2 at 2023-01-27T13:29:29.246Z
// Request #3 will wait 0ms
// Run request #3 at 2023-01-27T13:29:29.246Z
// Request #4 will wait 0ms
// Run request #4 at 2023-01-27T13:29:29.246Z
// Request #5 will wait 1000ms
// Request #6 will wait 1000ms
// Request #7 will wait 2000ms
// Request #8 will wait 2000ms
// Request #9 will wait 3000ms
// Run request #5 at 2023-01-27T13:29:30.249Z
// Run request #6 at 2023-01-27T13:29:30.250Z
// Run request #7 at 2023-01-27T13:29:31.248Z
// Run request #8 at 2023-01-27T13:29:31.249Z
// Run request #9 at 2023-01-27T13:29:32.249Z
```
