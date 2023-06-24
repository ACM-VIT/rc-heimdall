import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProblemsModule } from '../problems/problems.module';
import { TeamRepository } from './teams.repository';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './team.entity';

/**
 * **Team Module**
 *
 * Module to handle all operations related to [[Team]] Entity
 *
 * @category Teams
 */
@Module({
  imports: [TypeOrmModule.forFeature([Team]), ProblemsModule, HttpModule],
  controllers: [TeamsController],
  providers: [TeamsService, TeamRepository],
  exports: [TeamsService],
})
export class TeamsModule {}
