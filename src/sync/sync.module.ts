import { HttpModule, Module } from '@nestjs/common';

import { ProblemsModule } from 'src/problems/problems.module';
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
  imports: [ProblemsModule, HttpModule],
  controllers: [SyncController],
  providers: [SyncService],
})
export class SyncModule {}
