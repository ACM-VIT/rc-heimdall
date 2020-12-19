import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

/**
 * **Assign Problem DTO**
 *
 * AssignProblemDTO is responsible for handling input and validating the same
 * while assigning a problem to team.
 *
 * @category Teams
 */
export class AssignProblemDTO {
  /** numeric ID of [[Team]] ([[Team.id]]) to assign */
  @ApiProperty({ name: 'teamID', description: 'Numeric ID of team to assign problem to', example: 12 })
  @IsNumber()
  @IsNotEmpty()
  teamID: number;

  /** uuid of [[Problem]] ([[Problem.id]]) to be assigned to [[Team]] */
  @ApiProperty({
    name: 'problemID',
    description: 'UUID of problem to be assigned to team',
    example: '7702312b-eb3d-42cf-a40d-9fd3d8a4dc8e',
  })
  @IsNotEmpty()
  @IsUUID()
  problemID: string;

  /** points to be deducted in exchange of assigned problem */
  @ApiProperty({
    name: 'points',
    description: 'Points arithmetic related to problem assignment',
    example: -20,
  })
  @IsNotEmpty()
  @IsNumber()
  points: number;

  @ApiProperty({
    name: 'multiplier',
    description: 'Multiplier for code submission',
    example: 2,
    default: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  multiplier: number;

  @ApiProperty({
    name: 'phrase',
    description: 'obvious message',
    example: 'secure',
  })
  token: string;
}
