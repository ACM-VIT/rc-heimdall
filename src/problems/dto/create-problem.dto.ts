import { ApiProperty } from '@nestjs/swagger';

/**
 * **Create Problem DTO**
 *
 * CreateProblemDTO is responsible for handling input and validating the same
 * while creating a new problem. This data is unlikely to be off-structure but
 * to double check and ensure that the system is reliable and consistent, it's
 * also validated.
 *
 * @category Problems
 */

export class CreateProblemDto {
  /** short string to identify question, for humans */
  @ApiProperty({
    description: 'human read-able name of question',
  })
  name: string;

  /** maximum points that can be alloted if all test cases pass */
  @ApiProperty({
    description: 'Maximum points that can be alloted for the problem',
  })
  maxPoints: number;

  /**
   * URL to download input file, this file is not downloaded but read directly.
   * This data is streamed into STDIN when participant makes a submission.
   */
  @ApiProperty({ description: 'URL to download input file' })
  inputFileURL: string;

  /**
   * URL to download output file, this file is not downloaded but read directly.
   * The output of participant's code is checked against this file.
   */
  @ApiProperty({ description: 'URL to download output file ' })
  outputFileURL: string;

  /**
   * URL to download binary file(`.exe`) for windows users. This is shared directly
   * with users.
   */
  @ApiProperty({ description: 'URL to download windows(.exe) file' })
  windowsFileURL: string;

  /**
   * URL to download object files (for unix systems). This file is compiled
   * and then can be used on any unix system.
   */
  @ApiProperty({ description: 'URL to download object(.o) file' })
  objectFileURL: string;

  /**
   * URL to download object files (for mac systems). This file is compiled
   * and then can be used on any macOS system.
   */
  @ApiProperty({ description: 'URL to download object(.o) file' })
  macFileURL: string;

  /**
   * All problems have a short description to explain the type of inputs they
   * take, this is displayed directly in participant's portal.
   */
  @ApiProperty({ description: 'URL to download problem instructions' })
  instructionsFileURL: string;

  /**
   * This is the content of input file in plain text format.
   */
  @ApiProperty({ description: 'Actual text representation of input text' })
  inputText: string;

  /**
   * This is the content of output file in plain text format.
   */
  @ApiProperty({ description: 'Actual text representation of code output' })
  outputText: string;

  /**
   * This is the content of instructions file in plain text format.
   */
  @ApiProperty({ description: 'Actual text representation of instructions' })
  instructionsText: string;
}
