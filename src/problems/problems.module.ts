import { forwardRef, Module } from '@nestjs/common';
import { ProblemRepository } from './problems.repository';
import { ProblemsController } from './problems.controller';
import { ProblemsService } from './problems.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Problems } from './problem.entity';
import { JudgeModule } from '../judge/judge.module';
import { JudgeService } from 'src/judge/judge.service';

/**
 * **Problems Module**
 *
 * Module to handle all operations related to Problems Entity
 *
 * @category Problems
 */

@Module({
  imports: [TypeOrmModule.forFeature([Problems]), forwardRef(() => JudgeModule)],
  controllers: [ProblemsController],
  providers: [ProblemsService, ProblemRepository],
  exports: [ProblemsService],
})
export class ProblemsModule {}
