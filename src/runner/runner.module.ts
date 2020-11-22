import { Module } from '@nestjs/common';
import { RunnerService } from './runner.service';
import { RunnerController } from './runner.controller';

@Module({
  controllers: [RunnerController],
  providers: [RunnerService]
})
export class RunnerModule {}
