import { EntityRepository, Repository } from 'typeorm';
import { Problems } from './problem.entity';

@EntityRepository(Problems)
export class ProblemRepository extends Repository<Problems> {
  async findAndFilter(id: string): Promise<Problems> {
    const query = this.createQueryBuilder()
      .select([
        'problems.id',
        'problems.maxPoints',
        'problems.windowsFileURL',
        'problems.objectFileURL',
        'problems.instructionsText',
      ])
      .from(Problems, 'problems')
      .andWhere('problems.id = :id', { id })
      .getOne();

    return query;
  }
}
