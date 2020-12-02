import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsNotEmpty, IsEmail, IsBoolean, IsNumber } from 'class-validator';

export class CreateParticipantDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Google Auth ID of the participant', example: 'google_id_1' })
  googleID: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Name of the Participant', example: 'Yash Kumar Verma' })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'Email of the participant', example: 'yashkumar.verma2019@vitstudent.ac.in' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Registration Number of participant', example: '19BCE2669' })
  registrationNumber: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Phone number of participant', example: '8864813176' })
  phoneNumber: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Team Name of participant', example: 'team_1' })
  teamName: string;

  @IsBoolean()
  @ApiProperty({ description: 'if participant is admin of the team', example: false })
  isAdmin: boolean;
}
