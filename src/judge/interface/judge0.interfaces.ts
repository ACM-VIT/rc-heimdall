/**
 * This file contains all interfaces that define data i/o with [Judge0](https://github.com/judge0/judge0)
 *
 * @packageDocumentation
 */

/**
 * Structure of the body that is sent as post request to Judge0 deployment endpoint
 *
 * @category Judge
 */
export interface JudgeOSubmissionRequest {
  /** base64 encoded source code */
  source_code: string;

  /** numeric id of programming language */
  language_id: number;

  /** base64 encoded input for STDIN */
  stdin: string;

  /** base64 encoded expected output to evaluate */
  expected_output: string;

  /** URL to send submission back at */
  callback_url: string;
}

/**
 * Judge0 Submission status object
 *
 * @category Judge
 */
interface Judge0Status {
  /** ID of the submission status, check Judge0 docs*/
  id: number;

  /** test summary of submission status */
  description: string;
}

/**
 * Structure of the callback received from judge0 after evaluation
 *
 * @category Judge
 */
export interface Judge0Callback {
  /** response from program STDOUT */
  stdout: string;

  /** Judge0 uuid token to fetch results */
  token: string;

  /** status object */
  status: Judge0Status;

  /** output messages from compiler, like invalid token at line.... */
  compile_output?: string;

  /** message from Judge0 about submission */
  message?: string;

  /** time taken by submission to produce complete output */
  time?: string;

  /** memory occupied by submission */
  memory?: number;

  /** response from program STDERR */
  stderr?: string;
}
