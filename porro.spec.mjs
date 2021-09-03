import test from 'ava'

import { Porro } from './porro.mjs'

test('default', async t => {
  t.plan(6)

  const bucket = new Porro({
    bucketSize: 2,
    interval: 1000,
    queueSize: 1,
    tokensPerInterval: 2
  })

  t.is(bucket.request(), 0)
  t.is(bucket.request(), 0)

  const ms = bucket.request()
  t.true(ms > 900 && ms < 1100)

  t.throws(() => bucket.request())

  await new Promise(resolve => setTimeout(resolve, ms))

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
  const otherOptions = {
    bucketSize: 2,
    interval: 1000,
    queueSize: 1,
    tokensPerInterval: 2
  }
  t.throws(() => Porro())
  t.throws(() => new Porro())
  t.throws(() => new Porro(null))
  t.throws(() => new Porro({}))
  t.throws(() => new Porro({ ...otherOptions, bucketSize: '1' }))
  t.throws(() => new Porro({ ...otherOptions, interval: '1' }))
  t.throws(() => new Porro({ ...otherOptions, tokensPerInterval: '1' }))
  t.throws(() => new Porro({ ...otherOptions, queueSize: '1' }))
  t.throws(() => new Porro({ ...otherOptions, bucketSize: 0 }))
  t.throws(() => new Porro({ ...otherOptions, interval: 0 }))
  t.throws(() => new Porro({ ...otherOptions, tokensPerInterval: 0 }))
  t.throws(() => new Porro({ ...otherOptions, queueSize: -1 }))
})

test('throttle', async t => {
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
  t.true(time >= 3000 && time < 3100)
})

test('reset', async t => {
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
  const bucket = new Porro({
    bucketSize: 3,
    interval: 1000,
    tokensPerInterval: 2
  })

  await bucket.throttle()
  await bucket.throttle()
  await bucket.throttle()

  await new Promise(resolve => setTimeout(resolve, 2000))

  t.is(bucket.request(), 0)
})
