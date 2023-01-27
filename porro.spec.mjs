import test from 'ava'

import { Porro } from './porro.mjs'

function sleep (ms, result = true) {
  return new Promise(resolve => setTimeout(resolve, ms, result))
}

test('default', async t => {
  t.plan(5)

  const bucket = new Porro({
    bucketSize: 2,
    interval: 1000,
    tokensPerInterval: 2
  })

  t.is(bucket.request(), 0)
  t.is(bucket.request(), 0)

  const ms = bucket.request()
  t.true(ms > 900 && ms < 1100)

  await sleep(ms)

  t.is(bucket.request(), 0)
  t.true(bucket.request() > 0)
})

test('porro', async t => {
  t.plan(10)

  const bucket = new Porro({
    bucketSize: 2,
    interval: 1000,
    tokensPerInterval: 2
  })

  t.is(bucket.request(), 0)
  t.is(bucket.request(), 0)
  t.is(bucket.request(), 1000)
  t.is(bucket.request(), 1000)
  t.is(bucket.request(), 2000)
  t.is(bucket.request(), 2000)
  t.is(bucket.request(), 3000)
  t.is(bucket.request(), 3000)
  t.is(bucket.request(), 4000)
  t.is(bucket.request(), 4000)
})

test('options', t => {
  t.plan(11)

  const options = {
    bucketSize: 2,
    interval: 1000,
    tokensPerInterval: 2
  }
  t.truthy(new Porro(options))

  t.throws(() => Porro())
  t.throws(() => new Porro())
  t.throws(() => new Porro(null))
  t.throws(() => new Porro({}))
  t.throws(() => new Porro({ ...options, bucketSize: '1' }))
  t.throws(() => new Porro({ ...options, interval: '1' }))
  t.throws(() => new Porro({ ...options, tokensPerInterval: '1' }))
  t.throws(() => new Porro({ ...options, bucketSize: 0 }))
  t.throws(() => new Porro({ ...options, interval: 0 }))
  t.throws(() => new Porro({ ...options, tokensPerInterval: 0 }))
})

test('throttle', async t => {
  t.plan(1)

  const bucket = new Porro({
    bucketSize: 5,
    interval: 1000,
    tokensPerInterval: 2
  })

  const start = Date.now()
  for (let i = 0; i < 10; i++) {
    await bucket.throttle()
  }
  const end = Date.now()

  const time = end - start
  t.true(time >= 3000)
})

test('reset', async t => {
  t.plan(1)

  const bucket = new Porro({
    bucketSize: 5,
    interval: 1000,
    tokensPerInterval: 2
  })

  const start = Date.now()
  for (let i = 0; i < 10; i++) {
    await bucket.throttle()
    bucket.reset()
  }
  const end = Date.now()

  const time = end - start
  t.true(time >= 0 && time < 10)
})

test('refill', async t => {
  t.plan(1)

  const bucket = new Porro({
    bucketSize: 3,
    interval: 1000,
    tokensPerInterval: 2
  })

  await bucket.throttle()
  await bucket.throttle()
  await bucket.throttle()

  await sleep(2000)

  t.is(bucket.request(), 0)
})

test('quantity', async t => {
  t.plan(7)

  const bucket = new Porro({
    bucketSize: 10,
    interval: 100,
    tokensPerInterval: 2
  })

  t.is(bucket.request(), 0)
  t.is(bucket.request(), 0)
  t.is(bucket.request(), 0)
  t.is(bucket.request(7), 0)
  t.true(bucket.request(1) > 0)
  t.is(bucket.bucket, -1)
  await sleep(bucket.interval)
  bucket.refill()
  t.is(bucket.bucket, 1)
})

test('promise', async t => {
  t.plan(1)

  const bucket = new Porro({
    bucketSize: 10,
    interval: 100,
    tokensPerInterval: 2
  })

  await t.throwsAsync(bucket.throttle(-1))
})
