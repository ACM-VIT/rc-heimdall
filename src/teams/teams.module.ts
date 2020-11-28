import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { TeamRepository } from './teams.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TeamRepository])],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
