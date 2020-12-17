/**
 * **Judge0 Callback Status**
 *
 * [[CallbackStatusObject]] verifies the response received from Judge0 status
 * property.
 *
 * @category Judge
 */
class CallbackStatusObject {
  /** ID of the submission status, check Judge0 docs*/
  id: number;

  /** test summary of submission status */
  description: string;
}

/**
 * **Callback Judge Submission DTO**
 *
 * [[CallbackJudgeDto]] is responsible for handling input and validating the same
 * when receiving the callback request from Judge0 after code submission.
 *
 * @category Judge
 */
export class CallbackJudgeDto {
  /** response from program STDOUT */
  token: string;

  /** status object */
  status: CallbackStatusObject;
}
