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
  - `bucketSize` `<Number>` The size (number of tokens) of the bucket.
  - `interval` `<Number>` Time interval in milliseconds to refill the bucket.
  - `tokensPerInterval` `<Number>` Number of refilled tokens after the specified interval.
  - `[tokens]` `<Number>` Initial number of tokens. Defaults to `bucketSize`.
- Returns: `<Porro>`

### `Porro::tokens`

Getter and setter property. Gets or sets the current number of available tokens.

### `Porro::request([quantity])`

Returns the amount of time that the pending request needs to wait before executing.

- `[quantity]` `<Number>` Number (positive integer) of tokens to burn for the current request. Defaults to `1`.
- Returns: `<Number>`

### `Porro::throttle([quantity])`

Returns a `Promise` that will resolve when It's appropriate to execute the pending request.

- `[quantity]` `<Number>` Number (positive integer) of tokens to burn for the current request. Defaults to `1`.
- Returns: `<Promise>` Resolves with the waited milliseconds.

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
  log('script is starting')
  await Promise.all(items.map(doSomething))
}

async function doSomething (value, index) {
  // Get the waiting time for the currenct request
  const ms = bucket.request()

  // Sleep for the required time
  // You can also use `await bucket.throttle()` for simplicity
  if (ms > 0) {
    log(`request #${index} will wait ${ms}ms`)
    await sleep(ms)
  }

  // Do something!
  log(`run request #${index}`)
}

function log (message) {
  console.log(`[${new Date().toISOString()}]`, message, `(bucket has now ${bucket.tokens} tokens)`)
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

run()
// [2023-01-27T14:21:13.776Z] script is starting (bucket has now 5 tokens)
// [2023-01-27T14:21:13.779Z] run request #0 (bucket has now 4 tokens)
// [2023-01-27T14:21:13.779Z] run request #1 (bucket has now 3 tokens)
// [2023-01-27T14:21:13.779Z] run request #2 (bucket has now 2 tokens)
// [2023-01-27T14:21:13.779Z] run request #3 (bucket has now 1 tokens)
// [2023-01-27T14:21:13.779Z] run request #4 (bucket has now 0 tokens)
// [2023-01-27T14:21:13.779Z] request #5 will wait 1000ms (bucket has now -1 tokens)
// [2023-01-27T14:21:13.779Z] request #6 will wait 1000ms (bucket has now -2 tokens)
// [2023-01-27T14:21:13.779Z] request #7 will wait 2000ms (bucket has now -3 tokens)
// [2023-01-27T14:21:13.780Z] request #8 will wait 2000ms (bucket has now -4 tokens)
// [2023-01-27T14:21:13.780Z] request #9 will wait 3000ms (bucket has now -5 tokens)
// [2023-01-27T14:21:14.782Z] run request #5 (bucket has now -3 tokens)
// [2023-01-27T14:21:14.782Z] run request #6 (bucket has now -3 tokens)
// [2023-01-27T14:21:15.779Z] run request #7 (bucket has now -1 tokens)
// [2023-01-27T14:21:15.780Z] run request #8 (bucket has now -1 tokens)
// [2023-01-27T14:21:16.782Z] run request #9 (bucket has now 1 tokens)
```

## Donate

Thank you!

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/greguz)
