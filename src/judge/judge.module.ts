import { forwardRef, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { JudgeController } from './judge.controller';
import { JudgeRepository } from './judge.repository';
import { JudgeService } from './judge.service';
import { ProblemsModule } from '../problems/problems.module';
import { TeamsModule } from '../teams/teams.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestCaseModule } from 'src/testCase/testCase.module';
import { JudgeSubmissions } from './judge.entity';

/**
 * **Judge Module**
 *
 * Module to handle all operations related to Judge Entity
 *
 * @category Judge
 */
@Module({
  imports: [TypeOrmModule.forFeature([JudgeSubmissions]), HttpModule, forwardRef(() => ProblemsModule), TeamsModule, forwardRef(() => TestCaseModule)],
  controllers: [JudgeController],
  providers: [JudgeService, JudgeRepository],
  exports: [JudgeService],
})
export class JudgeModule {}
