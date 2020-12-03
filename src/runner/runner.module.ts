import { HttpModule, Module } from '@nestjs/common';

import { RunnerController } from './runner.controller';
import { RunnerService } from './runner.service';

/**
 * @category Module
 */
@Module({
  imports: [HttpModule],
  controllers: [RunnerController],
  providers: [RunnerService],
})
export class RunnerModule {}
