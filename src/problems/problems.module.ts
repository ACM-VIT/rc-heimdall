import { Module } from '@nestjs/common';
import { ProblemRepository } from './problems.repository';
import { ProblemsController } from './problems.controller';
import { ProblemsService } from './problems.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Problems } from './problem.entity';

/**
 * **Problems Module**
 *
 * Module to handle all operations related to Problems Entity
 *
 * @category Problems
 */

@Module({
  imports: [TypeOrmModule.forFeature([Problems])],
  controllers: [ProblemsController],
  providers: [ProblemsService, ProblemRepository],
  exports: [ProblemsService],
})
export class ProblemsModule {}
