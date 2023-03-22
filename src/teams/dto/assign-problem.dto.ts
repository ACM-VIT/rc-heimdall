import { IsNotEmpty, IsNumber, IsUUID, Max, Min } from 'class-validator';

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
  @IsNumber()
  @Max(6)
  @Min(0)
  hard: number;

  @IsNumber()
  @Max(6)
  @Min(0)
  medium: number;

  @IsNumber()
  @Max(6)
  @Min(0)
  easy: number;
}
