import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { TimeoutInterceptor } from 'src/interceptor/timeout.interceptor';
import { ExecuteCodeDto } from './dto/execute-code.dto';
import { RunnerService } from './runner.service';

/**
 * **Runner Controller**
 *
 * All routes related to task-runner / code execution are declared here, and the decorators
 * represent the type of request they respond to. Use ValidationPipe to validate client
 * requests, and the rules for validation are defined in [[ExecuteCodeDto]].
 *
 * The controller calls [[RunnerService]] for all operations.
 *
 * @category Participants
 */
@ApiTags('Code Runner')
@ApiBearerAuth('access-token')
@UseInterceptors(new TimeoutInterceptor())
@UseGuards(JwtAuthGuard)
@Controller('runner')
export class RunnerController {
  constructor(private readonly runnerService: RunnerService) {}

  /**
   * Responds to: _POST(`/`)_
   *
   * To execute problem binary with given input in [[ExecuteCodeDto]]
   */
  @Post()
  executeCode(@Body() requestDetails: ExecuteCodeDto) {
    return this.runnerService.execute(requestDetails);
  }
}
