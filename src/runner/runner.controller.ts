import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExecuteCodeDto } from './dto/execute-code.dto';
import { RunnerService } from './runner.service';

@ApiTags('Code Runner')
@Controller('runner')
export class RunnerController {
  constructor(private readonly runnerService: RunnerService) {}

  @Post()
  executeCode(@Body() requestDetails: ExecuteCodeDto) {
    return this.runnerService.execute(requestDetails);
  }
}
