export enum LoyverseErrorCode {
  /**
   * @description Generic internal server error. Try again later.
   */
  INTERNAL_SERVER_ERROR = 500,
  /**
   * @description General client error. The request was not understood by the server, generally due to bad syntax..
   */
  BAD_REQUEST = 400,
  /**
   * @description The JSON value type for the field is incorrect. For example, a string instead of an integer.
   */
  INCORRECT_VALUE_TYPE = 400,
  /**
   * @description A required path, query, or body parameter is missing.
   */
  MISSING_REQUIRED_PARAMETER = 400,
  /**
   * @description A parameter's value is incorrect.
   */
  INVALID_VALUE = 400,
  /**
   * @description Specified time range is incorrect. For example, the end time is before the start time.
   */
  INVALID_RANGE = 400,
  /**
   * @description The pagination cursor is incorrect.
   */
  INVALID_CURSOR = 400,
  /**
   * @description 1 or more of the request parameters conflict with each other.
   */
  CONFLICTING_PARAMETERS = 400,
  /**
     * @description An authentication error. Request had a missing, malformed, or invalid authorization data

     */
  UNAUTHORIZED = 401,
  /**
     * @description The subscription of account has lapsed

     */
  PAYMENT_REQUIRED = 40,
  /**
     * @description The resource requested is not available with your permissions

     */
  FORBIDDEN = 403,
  /**
     * @description The resource was not found

     */
  NOT_FOUND = 404,
  /**
   * @description The server doesn't accept the submitted content-type.
   */
  UNSUPPORTED_MEDIA_TYPE = 415,
  /**
   * @description The request was not accepted because the application has exceeded the rate limit.
   */
  RATE_LIMITED = 429,
}

export type KLoyverseErrorCode = keyof typeof LoyverseErrorCode;

export interface ILoyverseError {
  code: KLoyverseErrorCode;
  details: string;
  field: string;
}

export class LoyverseError {
  constructor(opts?: ILoyverseError) {
    if (opts) {
      this.code = opts.code;
      this.details = opts.details;
      this.field = opts.field;
    }
  }
  code: KLoyverseErrorCode;
  details: string;
  field: string;
  get statusCode(): number {
    return LoyverseErrorCode[this.code];
  }
}

export class LoyverseAPIError extends Error {
  constructor(public errors: LoyverseError[], public statusCode: number) {
    super('(Loyverse API Error)');
  }
}
