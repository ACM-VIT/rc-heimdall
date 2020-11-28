import { EntityRepository, Repository } from 'typeorm';
import { Problem } from './problem.entity';

@EntityRepository(Problem)
export class ProblemRepository extends Repository<Problem> {}
