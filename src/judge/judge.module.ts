import { HttpModule, Module } from '@nestjs/common';

import { JudgeController } from './judge.controller';
import { JudgeRepository } from './judge.repository';
import { JudgeService } from './judge.service';
import { ProblemsModule } from 'src/problems/problems.module';
import { TeamsModule } from 'src/teams/teams.module';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * **Judge Module**
 *
 * Module to handle all operations related to Judge Entity
 *
 * @category Judge
 */
@Module({
  imports: [TypeOrmModule.forFeature([JudgeRepository]), HttpModule, ProblemsModule, TeamsModule],
  controllers: [JudgeController],
  providers: [JudgeService],
})
export class JudgeModule {}
