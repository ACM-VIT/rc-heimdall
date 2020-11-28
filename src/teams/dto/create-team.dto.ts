import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTeamDto {
  @IsAlpha()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of team' })
  name: string;

  @IsNumber()
  @ApiProperty({ name: 'AdminID', description: 'ID of the participant to declare as admin' })
  adminID: number;
}
