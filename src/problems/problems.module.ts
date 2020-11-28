import { Module } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { ProblemsController } from './problems.controller';
import { ProblemRepository } from './problems.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProblemRepository])],
  controllers: [ProblemsController],
  providers: [ProblemsService],
})
export class ProblemsModule {}
