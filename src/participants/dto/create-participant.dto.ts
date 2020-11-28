import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsNotEmpty, IsEmail, IsBoolean, IsNumber } from 'class-validator';

export class CreateParticipantDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Google Auth ID of the participant' })
  googleID: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Name of the Participant' })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'Email of the participant' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Registration Number of participant' })
  registrationNumber: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Phone number of participant' })
  phoneNumber: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'ID of the team to join' })
  teamID: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'Team Name of participant' })
  teamName: string;

  @IsBoolean()
  @ApiProperty({ description: 'if participant is admin of the team' })
  isAdmin: boolean;
}
