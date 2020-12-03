import { EntityRepository, Repository } from 'typeorm';

import { Problems } from './problem.entity';

/**
 * **Problems Repository**
 *
 * This is the data persistence layer and is responsible for database related operations.
 *
 * @category Problems
 */
@EntityRepository(Problems)
export class ProblemRepository extends Repository<Problems> {
  /**
   * findAndFilter provides data to be passed to participants (clients). Since this response
   * need not contain the inputText or outputText, this is implemented as a custom query using
   * the query builder. To include additional columns into the response, add another item
   * to the `.select` array
   * */
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

  /**
   * findOneForJudge provides all the data required by [[JudgeService]] to evaluate a
   * submission. This includes the input, output and instructions in plainText format.
   * The response does not contain the downloadURLs as they are not required by the judge.
   */
  async findOneForJudge(id: string) {
    const query = this.createQueryBuilder()
      .select([
        'problems.id',
        'problems.inputText',
        'problems.outputText',
        'problems.instructionsText',
        'problems.name',
        'problems.maxPoints',
      ])
      .from(Problems, 'problems')
      .andWhere('problems.id = :id', { id })
      .getOne();

    return query;
  }
}
