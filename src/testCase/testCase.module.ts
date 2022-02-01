import { HttpModule, Module } from '@nestjs/common';

import { TestCaseController } from './testCase.controller';
import { TestCaseRepository } from './testCase.repository';
import { TestCaseService } from './testCase.service';
import { ProblemsModule } from '../problems/problems.module';
import { TeamsModule } from '../teams/teams.module';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * **Judge Module**
 *
 * Module to handle all operations related to Judge Entity
 *
 * @category Judge
 */
@Module({
  imports: [TypeOrmModule.forFeature([TestCaseRepository]), ProblemsModule, TeamsModule],
  controllers: [TestCaseController],
  providers: [TestCaseService],
  exports: [TestCaseService],
})
export class TestCaseModule {}
