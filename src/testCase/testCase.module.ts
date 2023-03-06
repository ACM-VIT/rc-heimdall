import { Module } from '@nestjs/common';

import { TestCaseController } from './testCase.controller';
import { TestCaseRepository } from './testCase.repository';
import { TestCaseService } from './testCase.service';
import { ProblemsModule } from '../problems/problems.module';
import { TeamsModule } from '../teams/teams.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JudgeModule } from 'src/judge/judge.module';
import { TestCase } from './testCase.entity';

/**
 * **Judge Module**
 *
 * Module to handle all operations related to Judge Entity
 *
 * @category Judge
 */
@Module({
  imports: [TypeOrmModule.forFeature([TestCase]), ProblemsModule, TeamsModule],
  controllers: [TestCaseController],
  providers: [TestCaseService, TestCaseRepository],
  exports: [TestCaseService]
})
export class TestCaseModule {}
