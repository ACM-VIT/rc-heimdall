import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsUUID } from 'class-validator';
import { CodeStates } from '../enum/codeStates.enum';

export class UpdateJudgeDto {
  @IsUUID()
  @ApiProperty({ description: 'ID of judge processing being updated' })
  judgeSubmissionID: number;

  @IsEnum(CodeStates)
  @ApiProperty({ description: 'New Code state of the submission' })
  state: CodeStates;

  @IsNumber()
  @ApiProperty({ description: 'Points to set for submission' })
  points: number;
}
