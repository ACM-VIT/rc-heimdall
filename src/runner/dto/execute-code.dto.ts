import { ApiProperty } from '@nestjs/swagger';

export class ExecuteCodeDto {
  @ApiProperty({
    description: 'id of the question to execute',
    required: true,
  })
  id: string;

  @ApiProperty({
    description: 'input to feed to the code binary via stdin',
    required: true,
  })
  input: string;
}
