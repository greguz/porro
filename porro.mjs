export class Porro {
  /**
   * Returns the current number of tokens inside the bucket.
   */
  get bucket () {
    this.refill()
    return this._bucket
  }

  /**
   * @constructor
   * @param {Object} options
   * @param {number} options.bucketSize - Number of tokens available inside the bucket.
   * @param {number} options.interval - Time interval in ms when tokens are refilled.
   * @param {number} options.tokensPerInterval - Number of refilled tokens per interval.
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

    this.bucketSize = bucketSize
    this.interval = interval
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
      ((now - this._lastRequest) * this.tokensPerInterval) / this.interval
    )

    // Update bucket status
    this._bucket += tokens
    this._lastRequest += Math.ceil(
      (tokens * this.interval) / this.tokensPerInterval
    )
    if (this._bucket > this.bucketSize) {
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

    // Reserve current request
    this._bucket -= quantity

    if (this._bucket >= 0) {
      // Bucket has room for this request, no delay
      return 0
    } else {
      // This request needs to wait
      const queuedTokens =
        Math.ceil(Math.abs(this._bucket) / this.tokensPerInterval) *
        this.tokensPerInterval
      const tokenInterval = this.interval / this.tokensPerInterval
      return Math.round(queuedTokens * tokenInterval)
    }
  }

  /**
   * Reset bucket to its initial status.
   */
  reset () {
    this._bucket = this.bucketSize
    this._lastRequest = Date.now()
  }

  /**
   * Requests a token and returns a Promise that will resolve when the request can execute.
   * @param {number} [quantity] Number (positive integer) of "tokens" to burn for the current request. Defaults to `1`.
   * @returns {Promise} Resolves with the waited milliseconds.
   */
  throttle (quantity = 1) {
    if (!Number.isInteger(quantity) || quantity < 1) {
      return Promise.reject(
        new TypeError('Tokens quantity must be a positive integer')
      )
    }
    const ms = this.request(quantity)
    if (ms > 0) {
      return new Promise(resolve => setTimeout(resolve, ms, ms))
    } else {
      return Promise.resolve(ms)
    }
  }
}
