import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTeamDto {
  @IsAlpha()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of team' })
  name: string;
}
