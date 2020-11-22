import { Controller } from '@nestjs/common';
import { RunnerService } from './runner.service';

@Controller('runner')
export class RunnerController {
  constructor(private readonly runnerService: RunnerService) {}
}
