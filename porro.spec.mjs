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
