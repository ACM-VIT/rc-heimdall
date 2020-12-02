export interface JudgeOSubmissionRequest {
  source_code: string;
  language_id: number;
  stdin: string;
  expected_output: string;
  callback_url: string;
}

interface Judge0Status {
  id: number;
  description: string;
}

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
