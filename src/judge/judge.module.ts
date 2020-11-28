import { Module } from '@nestjs/common';
import { JudgeService } from './judge.service';
import { JudgeController } from './judge.controller';

@Module({
  controllers: [JudgeController],
  providers: [JudgeService]
})
export class JudgeModule {}
