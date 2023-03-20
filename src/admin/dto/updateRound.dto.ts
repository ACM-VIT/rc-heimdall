import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class UpdateRoundDto {
  @IsNumber()
  @Max(2)
  @Min(0)
  @IsNotEmpty()
  status: number;
}
