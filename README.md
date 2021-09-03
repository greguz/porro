[![npm version](https://badge.fury.io/js/porro.svg)](https://badge.fury.io/js/porro)
[![ci](https://github.com/greguz/porro/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/greguz/porro/actions/workflows/ci.yaml)
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

### new Porro(options)

Porro's `constructor`.

- `options` `<Object>`
  - bucketSize `<Number>` The size (number of tokens) of the bucket.
  - interval `<Number>` Time interval in milliseconds to refill the bucket.
  - tokensPerInterval `<Number>` Number of refilled tokens after the specified interval.
  - [options.queueSize] `<Number>` Number of overflowing tokens allowed. Defaults to `50`.
- Returns: `<Porro>`

### Porro::request()

Returns the amount of time that the pending request needs to wait before executing.

- Returns: `<Number>`

### Porro::throttle()

Returns a `Promise` that will resolve when It's appropriate to execute the pending request.

- Returns: `<Promise>`

### Porro::reset()

Resets the bucket to its original status.

## Example

```javascript
import { Porro } from 'porro'

const bucket = new Porro({
  bucketSize: 5,
  interval: 1000,
  tokensPerInterval: 2
})

async function run () {
  const items = new Array(10).fill(null)
  const label = 'porro'

  console.time(label)
  await Promise.all(
    items.map(async (item, index) => {
      await bucket.throttle()
      console.timeLog(label)
      // do something useful
    })
  )
  console.timeEnd(label)
}

run()

// porro: 0.598ms
// porro: 3.749ms
// porro: 3.824ms
// porro: 3.894ms
// porro: 3.945ms
// porro: 1.001s
// porro: 1.002s
// porro: 2.001s
// porro: 2.001s
// porro: 3.001s
// porro: 3.002s
```
