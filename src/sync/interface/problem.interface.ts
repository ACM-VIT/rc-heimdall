/**
 * Interface represents the details of problem obtained from storage lambda function
 * @category Sync
 */
interface ProblemMetadata {
  /** problem id */
  id: string;

  /** .o file URL */
  object: string;

  /** input.txt file URL */
  input: string;

  /** instructions.txt file URL */
  instructions: string;

  /** output.txt file URL */
  output: string;

  /** windows binary download URL */
  windows?: string;

  /** mac file to download URL */
  mac?: string;

  /** plain text input */
  inputText?: string;

  /** plain text output */
  outputText?: string;

  /** plain text instruction */
  instructionsText?: string;
}

export { ProblemMetadata };
