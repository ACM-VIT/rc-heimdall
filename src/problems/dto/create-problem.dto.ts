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

  @ApiProperty({
    description: 'Location of file where test-cases are stored',
  })
  inputFileLocation: string;

  @ApiProperty({
    description: 'Location of file where outputs for test-cases are stored',
  })
  outputFileLocation: string;

  @ApiProperty({
    description: 'Google Storage bucket link to download .exe file',
  })
  exeFileURL: string;

  @ApiProperty({
    description: 'Google Storage bucket link to download .o file',
  })
  oFileURL: string;
}
