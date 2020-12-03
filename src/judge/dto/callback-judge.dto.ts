import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * **Judge0 Callback Status**
 *
 * [[CallbackStatusObject]] verifies the response received from Judge0 status
 * property.
 *
 * @category Judge
 */
class CallbackStatusObject {
  /** ID of the submission status, check Judge0 docs*/
  @IsNumber()
  id: number;

  /** test summary of submission status */
  @IsString()
  @IsNotEmpty()
  description: string;
}

/**
 * **Callback Judge Submission DTO**
 *
 * [[CallbackJudgeDto]] is responsible for handling input and validating the same
 * when receiving the callback request from Judge0 after code submission.
 *
 * @category Judge
 */
export class CallbackJudgeDto {
  /** response from program STDOUT */
  @ApiProperty({
    name: 'stdout',
    description: 'Base64 encoded program output',
    example: 'MQ==\n',
  })
  @IsString()
  @IsNotEmpty()
  stdout: string;

  /** Judge0 uuid token to fetch results */
  @ApiProperty({
    name: 'token',
    description: 'Judge0 Identification token',
    example: '9bf5b6fe-358b-4915-ad74-fe8a4cbb2c3c',
  })
  @IsUUID()
  @IsNotEmpty()
  token: string;

  /** status object */
  @ApiProperty({
    name: 'status',
    description: 'Object containing status id and description',
    example: {
      id: 4,
      description: 'Wrong Answer',
    },
  })
  @Type(() => CallbackStatusObject)
  status: CallbackStatusObject;
}
