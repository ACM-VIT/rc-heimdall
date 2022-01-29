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
  inputText1?: string;
  inputText2?: string;
  inputText3?: string;
  inputText4?: string;
  inputText5?: string;

  /** plain text output */
  outputText1?: string;
  outputText2?: string;
  outputText3?: string;
  outputText4?: string;
  outputText5?: string;

  /** plain text instruction */
  instructionsText?: string;

  /** multiplier for submission */
  multiplier: number;

  /** sample input for bidding */
  sampleInput: string;

  /** sample output for bidding */
  sampleOutput: string;
}

export { ProblemMetadata };
