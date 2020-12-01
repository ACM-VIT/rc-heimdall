import { HttpModule, Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { ProblemsModule } from 'src/problems/problems.module';

@Module({
  imports: [ProblemsModule, HttpModule],
  controllers: [SyncController],
  providers: [SyncService],
})
export class SyncModule {}
