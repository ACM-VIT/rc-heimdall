import { ApiProperty } from '@nestjs/swagger';

/**
 * **Execute Code DTO**
 *
 * ExecuteCodeDto is responsible for handling input and validating the same
 * while running a. This data is unlikely to be off-structure but  to double
 * check and ensure that the system is reliable and consistent, it's also validated.
 *
 * @category Runner
 */

export class ExecuteCodeDto {
  /** id of the question to execute */
  @ApiProperty({
    description: 'id of the question to execute',
    required: true,
  })
  id: string;

  /** input to stream into STDIN while executing */
  @ApiProperty({
    description: 'input to feed to the code binary via stdin',
    required: true,
  })
  input: string;
}
