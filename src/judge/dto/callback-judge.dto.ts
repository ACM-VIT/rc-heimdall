import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

class CallbackStatusObject {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class CallbackJudgeDto {
  @ApiProperty({
    name: 'stdout',
    description: 'Base64 encoded program output',
    example: 'MQ==\n',
  })
  @IsString()
  @IsNotEmpty()
  stdout: string;

  @ApiProperty({
    name: 'token',
    description: 'Judge0 Identification token',
    example: '9bf5b6fe-358b-4915-ad74-fe8a4cbb2c3c',
  })
  @IsUUID()
  @IsNotEmpty()
  token: string;

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
