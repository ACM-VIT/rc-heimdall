import { Module } from '@nestjs/common';
import { ParticipantsController } from './participants.controller';
import { ParticipantsService } from './participants.service';
import { TeamsModule } from '../teams/teams.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participant } from './participant.entity';
import { JudgeModule } from 'src/judge/judge.module';

/**
 * **Participants Module**
 *
 * Module to handle all operations related to Participant Entity
 *
 * @category Participants
 */
@Module({
  imports: [TypeOrmModule.forFeature([Participant]), TeamsModule, JudgeModule],
  controllers: [ParticipantsController],
  providers: [ParticipantsService],
  exports: [ParticipantsService],
})
export class ParticipantsModule {}
