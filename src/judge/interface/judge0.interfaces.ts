export interface JudgeOSubmissionRequest {
  source_code: string;
  language_id: number;
  stdin: string;
  expected_output: string;
  callback_url: string;
}
