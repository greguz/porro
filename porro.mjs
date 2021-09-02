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
      throw new Error('Bucket options are mandatory')
    }

    const bucketSize = options.bucketSize || 0
    if (!Number.isInteger(bucketSize) || bucketSize <= 0) {
      throw new Error('Bucket size must be a positive integer')
    }

    const interval = options.interval || 0
    if (!Number.isInteger(interval) || interval <= 0) {
      throw new Error('Interval must be a positive integer')
    }

    const tokensPerInterval = options.tokensPerInterval || 0
    if (!Number.isInteger(tokensPerInterval) || tokensPerInterval <= 0) {
      throw new Error('Tokens per interval must be a positive integer')
    }

    const queueSize = options.queueSize === undefined ? 50 : options.queueSize
    if (!Number.isInteger(queueSize) || queueSize < 0) {
      throw new Error('Queue size must be a positive integer or zero')
    }

    this.bucketSize = bucketSize
    this.interval = interval
    this.queueSize = queueSize
    this.tokensPerInterval = tokensPerInterval

    this.reset()
  }

  /**
   * Returns the delay that the request will wait before the execution.
   */
  request () {
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

    // Reserve current request (one token)
    if (this.bucket < 0 && Math.abs(this.bucket) >= this.queueSize) {
      throw new Error('Bucket overflow')
    }
    this.bucket--

    if (this.bucket >= 0) {
      // Bucket has room for this request, no delay
      return 0
    } else {
      // This request needs to wait
      const queuedTokens =
        Math.ceil(Math.abs(this.bucket) / this.tokensPerInterval) *
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
   * @returns {Promise}
   */
  throttle () {
    return new Promise(resolve => {
      const ms = this.request()
      if (ms > 0) {
        setTimeout(resolve, ms)
      } else {
        resolve()
      }
    })
  }
}
