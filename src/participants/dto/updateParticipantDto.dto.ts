import { IsBoolean, IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

/**
 * **Update Participant DTO**
 *
 * UpdateParticipantDto is responsible for handling input and validating the same
 * while updating the existing participant.
 *
 * @category Participants
 */
export class UpdateParticipantDto {
  /** id of the participant */
  @ApiProperty({ description: 'id of the participant', example: 1 })
  id: number;

  /** College of the participant */
  @IsNotEmpty()
  @ApiProperty({ description: 'College of the participant', example: 'VIT' })
  college: string;

  /** Registration Number of the participant */
  @IsNotEmpty()
  @ApiProperty({ description: 'Registration Number of the participant', example: '20BCE0999' })
  registrationNumber: string;

  /** Phone Number of the participant */
  @IsNotEmpty()
  @ApiProperty({ description: 'Phone Number of the participant', example: 9876543210 })
  phoneNumber: string;

  /** Check if the participant is fresher or not */
  @IsBoolean()
  @ApiProperty({ description: 'Check if the participant is fresher or not', example: false })
  fresher: boolean;
}
