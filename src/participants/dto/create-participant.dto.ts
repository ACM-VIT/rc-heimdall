import { IsBoolean, IsEmail, IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

/**
 * **Create Participant DTO**
 *
 * CreateParticipantDto is responsible for handling input and validating the same
 * while creating a new participant.
 *
 * @category Participants
 */
export class CreateParticipantDto {
  /** GoogleID obtained after OAuth */
  @IsNotEmpty()
  @ApiProperty({ description: 'Google Auth ID of the participant', example: 'google_id_1' })
  googleID: string;

  /** Name of the participant */
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of the Participant', example: 'Yash Kumar Verma' })
  name: string;

  /** Email of the participant */
  @IsEmail()
  @ApiProperty({ description: 'Email of the participant', example: 'yashkumar.verma2019@vitstudent.ac.in' })
  email: string;

  /** College registration number of participant */
  @ApiProperty({ description: 'Registration Number of participant', example: '19BCE2669' })
  registrationNumber: string;

  /** phone number of participant */
  @ApiProperty({ description: 'Phone number of participant', example: '8864813176' })
  phoneNumber: string;

  /** team name of participant, references [[Team]] by [[Team.name]] */
  @IsNotEmpty()
  @ApiProperty({ description: 'Team Name of participant', example: 'team_1' })
  teamName: string;

  /** whether participant is admin of his/her team */
  @IsBoolean()
  @ApiProperty({ description: 'if participant is admin of the team', example: false })
  isAdmin: boolean;
}
