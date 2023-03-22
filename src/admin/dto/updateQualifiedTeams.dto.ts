import { IsArray, IsNotEmpty } from 'class-validator';

export class UpdateQualifiedTeamsDto {
  @IsNotEmpty()
  qualifiedTeams: number[];
}
