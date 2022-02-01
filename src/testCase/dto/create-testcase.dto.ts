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
 * **Create TestCase Submission DTO**
 *
 * @category Judge
 */
export class createTestCaseDto {
  /** response from program STDOUT */
  token: string;

  /** testcase number */
  testCaseNumber: number;

  /** status object */
  status: CallbackStatusObject;
}
