import { ApiProperty } from '@nestjs/swagger';

export class CreateProblemDto {
  @ApiProperty({
    description: 'human read-able name of question',
  })
  name: string;

  @ApiProperty({
    description: 'Maximum points that can be alloted for the problem',
  })
  maxPoints: number;

  @ApiProperty({ description: 'URL to download input file' })
  inputFileURL: string;

  @ApiProperty({ description: 'URL to download output file ' })
  outputFileURL: string;

  @ApiProperty({ description: 'URL to download windows(.exe) file' })
  windowsFileURL: string;

  @ApiProperty({ description: 'URL to download object(.o) file' })
  objectFileURL: string;

  @ApiProperty({ description: 'URL to download code instructions' })
  instructionsFileURL: string;

  @ApiProperty({ description: 'Actual text representation of input text' })
  inputText: string;

  @ApiProperty({ description: 'Actual text representation of code output' })
  outputText: string;

  @ApiProperty({ description: 'Actual text representation of instructions' })
  instructionsText: string;
}
