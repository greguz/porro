export interface PorroOptions {
  /**
   * Number of tokens available inside the bucket.
   */
  bucketSize: number;
  /**
   * Time interval in ms when tokens are refilled.
   */
  interval: number;
  /**
   * Number of refilled tokens per interval.
   */
  tokensPerInterval: number;
}

export declare class Porro {
  public readonly bucketSize: number;
  public readonly interval: number;
  public readonly tokensPerInterval: number;
  /**
   * @constructor
   */
  constructor(options: PorroOptions);
  /**
   * Returns the delay that the request will wait before the execution.
   * @param {number} [quantity] Number (positive integer) of "tokens" to burn for the current request. Defaults to `1`.
   * @returns {number}
   */
  request(quantity?: number): number;
  /**
   * Reset bucket to its initial status.
   */
  reset(): void;
  /**
   * Requests a token and returns a `Promise` that will resolve when the request can execute.
   * @param {number} [quantity] Number (positive integer) of "tokens" to burn for the current request. Defaults to `1`.
   * @returns {Promise} Resolves with the waited milliseconds.
   */
  throttle(quantity?: number): Promise<number>;
}
