import { HttpModule, Module } from '@nestjs/common';
import { JudgeService } from './judge.service';
import { JudgeController } from './judge.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JudgeRepository } from './judge.repository';
import { ProblemsModule } from 'src/problems/problems.module';
import { TeamsModule } from 'src/teams/teams.module';

@Module({
  imports: [TypeOrmModule.forFeature([JudgeRepository]), HttpModule, ProblemsModule, TeamsModule],
  controllers: [JudgeController],
  providers: [JudgeService],
})
export class JudgeModule {}
