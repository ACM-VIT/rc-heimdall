import { IsAlpha, IsNotEmpty, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

/**
 * @class
 * @typedef {Object} CreateTeamDto
 * @property {string} name : name of the team
 */
export class CreateTeamDto {
  @IsAlpha()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ description: 'Name of team', type: String, example: 'January Jaguars', required: true, minLength: 6 })
  name: string;
}
