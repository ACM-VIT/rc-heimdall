import { IsBase64, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

/**
 * **Create Judge Submission DTO**
 *
 * [[CreateJudgeDto]] is responsible for handling input and validating the same
 * while creating a new submission for a problem
 *
 * @category Judge
 */
export class CreateJudgeDto {
  /** uuid representing [[Problems.id]] */
  @IsUUID()
  @ApiProperty({ description: 'uuid of the problem', example: '4b7e09cb-90a5-4d9a-92d9-28662489f851' })
  problemID: string;

  /** TeamID who made the submission, references [[Team]] via [[Team.id]] */
  @IsNumber()
  @ApiProperty({ description: 'ID of the team making the submission', example: 2 })
  teamID: number;

  /** Language in which the submission is made */
  @IsNotEmpty()
  @ApiProperty({
    description: 'extension of the language of code like c,cpp, go, java, py, js, kt',
    example: 'cpp',
  })
  language: string;

  /** Base64 encoded code for submission */
  @IsNotEmpty()
  @IsBase64()
  @ApiProperty({
    description: 'code to run in judge',
    example: 'I2luY2x1ZGU8aW9zdHJlYW0+CnVzaW5nIG5hbWVzcGFjZSBzdGQ7CmludCBtYWluKCl7CmNvdXQ8PDE7CiByZXR1cm4gMDsgCiB9IAo=',
  })
  code: string;
}
