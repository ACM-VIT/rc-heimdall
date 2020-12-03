import { HttpModule, Module } from '@nestjs/common';

import { RunnerController } from './runner.controller';
import { RunnerService } from './runner.service';

/**
 * **Runner Module**
 *
 * Module to handle all operations related to task execution / code runner.
 *
 * @category Runner
 */
@Module({
  imports: [HttpModule],
  controllers: [RunnerController],
  providers: [RunnerService],
})
export class RunnerModule {}
