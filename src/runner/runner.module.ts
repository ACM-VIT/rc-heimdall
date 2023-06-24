import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { ProblemsModule } from '../problems/problems.module';
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
  imports: [HttpModule, ProblemsModule],
  controllers: [RunnerController],
  providers: [RunnerService],
})
export class RunnerModule {}
