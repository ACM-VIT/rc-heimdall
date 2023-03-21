import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class UpdateRoundDto {
  @IsNumber()
  @Max(4)
  @Min(0)
  @IsNotEmpty()
  round: number;
}
