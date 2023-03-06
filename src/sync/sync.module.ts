import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { JudgeModule } from 'src/judge/judge.module';
import { ParticipantsModule } from 'src/participants/participants.module';
import { TeamsModule } from 'src/teams/teams.module';
import { TestCaseModule } from 'src/testCase/testCase.module';
import { ProblemsModule } from '../problems/problems.module';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';

/**
 * **Sync Module**
 *
 * Module to handle all operations related to data synchronization
 *
 * @category Sync
 */
@Module({
  imports: [ProblemsModule, ParticipantsModule, JudgeModule, HttpModule, TestCaseModule, TeamsModule],
  controllers: [SyncController],
  providers: [SyncService],
})
export class SyncModule {}
