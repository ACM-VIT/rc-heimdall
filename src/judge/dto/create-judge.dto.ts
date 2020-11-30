import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateJudgeDto {
  @IsUUID()
  @ApiProperty({ description: 'uuid of the problem' })
  problemID: string;

  @IsNumber()
  @ApiProperty({ description: 'ID of the team making the submission' })
  teamID: number;

  @IsNumber()
  @ApiProperty({ description: 'short representation of the language of code like c, cpp, go, java, py, js, kt' })
  language: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'code to run in judge' })
  code: string;
}
