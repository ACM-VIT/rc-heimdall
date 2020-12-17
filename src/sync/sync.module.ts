import { HttpModule, Module } from '@nestjs/common';

import { JudgeModule } from 'src/judge/judge.module';
import { ParticipantsModule } from 'src/participants/participants.module';
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
  imports: [ProblemsModule, ParticipantsModule, JudgeModule, HttpModule],
  controllers: [SyncController],
  providers: [SyncService],
})
export class SyncModule {}
