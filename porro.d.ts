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
  /**
   * Initial number of tokens. Defaults to `bucketSize`.
   */
  tokens?: number;
}

export declare class Porro {
  /**
   * Configured bucket size (max number of tokens inside the buffer).
   */
  readonly bucketSize: number;
  /**
   * Configured time interval in milliseconds.
   */
  readonly interval: number;
  /**
   * Configured number of restored tokens after one time interval.
   */
  readonly tokensPerInterval: number;
  /**
   * @deprecated Use `.tokens` instead.
   */
  get bucket(): number;
  /**
   * Returns the current number of tokens inside the bucket.
   */
  get tokens(): number;
  /**
   * Set the current amount of available tokens.
   */
  set tokens(value: number);
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
