import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateJudgeDto {
  @IsUUID()
  @ApiProperty({ description: 'uuid of the problem', example: 'b3131232-a8fc-416f-8417-3305c917217e' })
  problemID: string;

  @IsNumber()
  @ApiProperty({ description: 'ID of the team making the submission', example: 2 })
  teamID: number;

  @IsNumber()
  @ApiProperty({
    description: 'short representation of the language of code like c, cpp, go, java, py, js, kt',
    example: 'cpp',
  })
  language: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'code to run in judge',
    example: '#include<stdio.h>\nusing namespace std;\nint main(){\ncout<<1;\n return 0; \n } \n',
  })
  code: string;
}
