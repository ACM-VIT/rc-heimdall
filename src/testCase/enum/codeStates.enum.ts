import * as config from 'config';

/**
 * This is the exhaustive list of all responses that the server can give.
 * The expected use of this is only as a syntactic sugar, to avoid wiring ids manually
 *
 * @category Judge
 * @enum {number}
 * @readonly
 */
export enum CodeStates {
  AWAIT = 0,
  IN_QUEUE,
  PROCESSING,
  ACCEPTED,
  WRONG,
  TLE,
  COMPILATION_ERROR,
  RUNTIME_ERROR,
  INTERNAL_ERROR,
  CODE_ERROR,
}

/**
 * This maps all responses that Judge0 returns to possible CodeStates.
 * This is added to convert to map responses from Judge0 into the enum format being used
 * in the application
 *
 * @category Judge
 * @readonly
 * @tutorial Await has been added as indexing for Judge0 responses start from 1
 */
export const CODE_STATES: Array<CodeStates> = [
  CodeStates.AWAIT,
  CodeStates.IN_QUEUE,
  CodeStates.PROCESSING,
  CodeStates.ACCEPTED,
  CodeStates.WRONG,
  CodeStates.TLE,
  CodeStates.COMPILATION_ERROR,
  CodeStates.RUNTIME_ERROR,
  CodeStates.RUNTIME_ERROR,
  CodeStates.RUNTIME_ERROR,
  CodeStates.RUNTIME_ERROR,
  CodeStates.RUNTIME_ERROR,
  CodeStates.RUNTIME_ERROR,
  CodeStates.INTERNAL_ERROR,
  CodeStates.CODE_ERROR,
];

/**
 * This array can be used to convert the above given enum values to custom error messages.
 * All responses sent by the application are sent from here.
 *
 * @category Judge
 * @readonly
 * @tutorial repetitions : the repetitions towards the end of the array are to club multiple
 * types of responses into one so that end user does not come across internals of the service.
 */
export const DILUTE: Array<string> = [
  'Await',
  config.get('code_response.in_queue') || 'in_queue',
  config.get('code_response.processing') || 'processing',
  config.get('code_response.accepted') || 'accepted',
  config.get('code_response.wrong') || 'wrong',
  config.get('code_response.tle') || 'tle',
  config.get('code_response.compilation_error') || 'compilation_error',
  config.get('code_response.runtime_error') || 'runtime_error',
  config.get('code_response.runtime_error') || 'runtime_error',
  config.get('code_response.runtime_error') || 'runtime_error',
  config.get('code_response.runtime_error') || 'runtime_error',
  config.get('code_response.runtime_error') || 'runtime_error',
  config.get('code_response.runtime_error') || 'runtime_error',
  config.get('code_response.internal_error') || 'internal_error',
  config.get('code_response.code_error') || 'code_error',
  config.get('code_response.code_error') || 'code_error',
  config.get('code_response.code_error') || 'code_error',
  config.get('code_response.code_error') || 'code_error',
  config.get('code_response.code_error') || 'code_error',
  config.get('code_response.code_error') || 'code_error',
  config.get('code_response.code_error') || 'code_error',
  config.get('code_response.code_error') || 'code_error',
  config.get('code_response.code_error') || 'code_error',
  config.get('code_response.code_error') || 'code_error',
];
