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
  source_code: string;
  language_id: number;
  stdin: string;
  expected_output: string;
  callback_url: string;
}

/**
 * Judge0 Submission status object
 *
 * @category Judge
 */
interface Judge0Status {
  id: number;
  description: string;
}

/**
 * Structure of the callback received from judge0 after evaluation
 *
 * @category Judge
 */
export interface Judge0Callback {
  stdout: string | null;
  time: string;
  memory: number;
  stderr: string | null;
  token: string;
  compile_output: string | null;
  message: string | null;
  status: Judge0Status;
}
