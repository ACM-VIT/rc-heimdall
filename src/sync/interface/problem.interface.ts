/**
 * Interface represents the details of problem obtained from storage lambda function
 *
 * @category Sync
 */
export interface ProblemMetadata {
  id: string;
  object: string;
  input: string;
  instructions: string;
  output: string;
  windows?: string;
  inputText?: string;
  outputText?: string;
  instructionsText?: string;
}
