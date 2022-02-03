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
  /** uuid of [[Problem]] ([[Problem.id]]) to be assigned to [[Team]] */
  @ApiProperty({
    name: 'problemID',
    description: 'UUID of problem to be assigned to team',
    example: '7702312b-eb3d-42cf-a40d-9fd3d8a4dc8e',
  })
  @IsNotEmpty()
  @IsUUID()
  problemID: string;
}
