import { Module } from '@nestjs/common';
import { JudgeService } from './judge.service';
import { JudgeController } from './judge.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JudgeRepository } from './judge.repository';
import { ProblemsModule } from 'src/problems/problems.module';

@Module({
  imports: [TypeOrmModule.forFeature([JudgeRepository]), ProblemsModule],
  controllers: [JudgeController],
  providers: [JudgeService],
})
export class JudgeModule {}
