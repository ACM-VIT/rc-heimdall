import { Module } from '@nestjs/common';
import { TeamRepository } from './teams.repository';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * **Team Module**
 *
 * Module to handle all operations related to [[Team]] Entity
 *
 * @category Teams
 */
@Module({
  imports: [TypeOrmModule.forFeature([TeamRepository])],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}
