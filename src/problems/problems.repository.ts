import { EntityRepository, Repository } from 'typeorm';
import { Problems } from './problem.entity';

@EntityRepository(Problems)
export class ProblemRepository extends Repository<Problems> {}
