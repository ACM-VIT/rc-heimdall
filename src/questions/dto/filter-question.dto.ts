import { ApiProperty } from '@nestjs/swagger';

export class GetQuestionDto {
  @ApiProperty({
    description: 'id of the question to check if it exists',
    required: true,
  })
  id: string;
}
