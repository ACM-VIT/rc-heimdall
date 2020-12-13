import { Module } from '@nestjs/common';
import { ParticipantRepository } from './participants.repository';
import { ParticipantsController } from './participants.controller';
import { ParticipantsService } from './participants.service';
import { TeamsModule } from '../teams/teams.module';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * **Participants Module**
 *
 * Module to handle all operations related to Participant Entity
 *
 * @category Participants
 */
@Module({
  imports: [TypeOrmModule.forFeature([ParticipantRepository]), TeamsModule],
  controllers: [ParticipantsController],
  providers: [ParticipantsService],
})
export class ParticipantsModule {}
