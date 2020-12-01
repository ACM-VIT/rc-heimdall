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
