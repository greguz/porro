export class Porro {
  /**
   * @constructor
   * @param {Object} options
   * @param {number} options.bucketSize - Number of tokens available inside the bucket.
   * @param {number} options.interval - Time interval in ms when tokens are refilled.
   * @param {number} options.tokensPerInterval - Number of refilled tokens per interval.
   * @param {number} [options.queueSize=50] - Number of allowed overflowing requests.
   */
  constructor (options) {
    if (typeof options !== 'object' || options === null) {
      options = {}
    }

    const bucketSize = options.bucketSize || 0
    if (!Number.isInteger(bucketSize) || bucketSize <= 0) {
      throw new TypeError('Option bucketSize must be a positive integer')
    }

    const interval = options.interval || 0
    if (!Number.isInteger(interval) || interval <= 0) {
      throw new TypeError('Option interval must be a positive integer')
    }

    const tokensPerInterval = options.tokensPerInterval || 0
    if (!Number.isInteger(tokensPerInterval) || tokensPerInterval <= 0) {
      throw new TypeError('Option tokensPerInterval must be a positive integer')
    }

    const queueSize = options.queueSize === undefined ? 50 : options.queueSize
    if (!Number.isInteger(queueSize) || queueSize < 0) {
      throw new TypeError('Option queueSize must be a positive integer or zero')
    }

    this.bucketSize = bucketSize
    this.interval = interval
    this.queueSize = queueSize
    this.tokensPerInterval = tokensPerInterval

    this.reset()
  }

  /**
   * Refill the bucket from the previous iteration.
   */
  refill () {
    // Number of tokens refilled from the last call
    const now = Date.now()
    const tokens = Math.floor(
      ((now - this.lastRequest) * this.tokensPerInterval) / this.interval
    )

    // Update bucket status
    this.bucket += tokens
    this.lastRequest += Math.ceil(
      (tokens * this.interval) / this.tokensPerInterval
    )
    if (this.bucket > this.bucketSize) {
      this.reset()
    }
  }

  /**
   * Returns the delay that the request will wait before the execution.
   * @param {number} [quantity] Number (positive integer) of "tokens" to burn for the current request. Defaults to `1`.
   * @returns {number}
   */
  request (quantity = 1) {
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new TypeError('Tokens quantity must be a positive integer')
    }

    // Sync bucket status
    this.refill()

    // Apply "overflow" protection
    const bucket = this.bucket - quantity
    if (bucket < 0 && Math.abs(bucket) > this.queueSize) {
      throw new Error('Queue size limit reached')
    }

    // Reserve current request
    this.bucket = bucket

    if (bucket >= 0) {
      // Bucket has room for this request, no delay
      return 0
    } else {
      // This request needs to wait
      const queuedTokens =
        Math.ceil(Math.abs(bucket) / this.tokensPerInterval) *
        this.tokensPerInterval
      const tokenInterval = this.interval / this.tokensPerInterval
      return Math.round(queuedTokens * tokenInterval)
    }
  }

  /**
   * Reset bucket to its initial status.
   */
  reset () {
    this.bucket = this.bucketSize
    this.lastRequest = Date.now()
  }

  /**
   * Requests a token and returns a Promise that will resolve when the request can execute.
   * @param {number} [quantity] Number (positive integer) of "tokens" to burn for the current request. Defaults to `1`.
   * @returns {Promise}
   */
  throttle (quantity) {
    return new Promise(resolve => {
      const ms = this.request(quantity)
      if (ms > 0) {
        setTimeout(resolve, ms)
      } else {
        resolve()
      }
    })
  }
}
