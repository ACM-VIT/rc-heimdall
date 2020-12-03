import { IsAlpha, IsNotEmpty, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

/**
 * **Create Team DTO**
 *
 * CreateTeamDto is responsible for handling input and validating the same
 * while creating a new teams. This data is unlikely to be off-structure but
 * to double check and ensure that the system is reliable and consistent, it's
 * also validated.
 *
 * @category Teams
 */
export class CreateTeamDto {
  /** name of the team  */
  @IsAlpha()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ description: 'Name of team', type: String, example: 'January Jaguars', required: true, minLength: 6 })
  name: string;
}
