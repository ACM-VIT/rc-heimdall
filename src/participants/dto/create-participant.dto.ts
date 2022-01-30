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

  /** whether participant is admin of his/her team */
  @IsBoolean()
  @ApiProperty({ description: 'if participant is admin of the team', example: false })
  isAdmin: boolean;

  /** teamId of the participant, references [[Team]] by [[Team.id]] */
  @ApiProperty()
  team_id: number;

  /** team of the participant, references [[Team]] by [[Team.id]] */
  @ApiProperty()
  team: {
    name: string;
  };
}
