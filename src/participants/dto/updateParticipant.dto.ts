import { IsBoolean, IsNotEmpty, IsPhoneNumber, IsString, Length, IsNumber, Min, Max } from 'class-validator';

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
         /** University of the participant */
         @IsNotEmpty()
         @IsString()
         @ApiProperty({ description: 'University of the participant', example: 'VIT' })
         uniName: string;

         /** Registration Number of the participant */
         @IsString()
         @ApiProperty({ description: 'Registration Number of the participant', example: '20BCE0999' })
         regNum: string;

         /** Phone Number of the participant */
         @ApiProperty({ description: 'Phone Number of the participant', example: 9876543210 })
         @IsNumber()
         @Min(0)
         @Max(922337203685477)
         phone: number;

         /** Check if the participant is fresher or not */
         @IsBoolean()
         @ApiProperty({ description: 'Check if the participant is fresher or not', example: false })
         fresher: boolean;
       }
