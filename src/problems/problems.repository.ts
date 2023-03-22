import { EntityRepository, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Problems } from './problem.entity';

/**
 * **Problems Repository**
 *
 * This is the data persistence layer and is responsible for database related operations.
 *
 * @category Problems
 */
@Injectable()
export class ProblemRepository extends Repository<Problems> {
  constructor(@InjectRepository(Problems) private repository: Repository<Problems>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  /**
   * findAndFilter provides data to be passed to participants (clients). Since this response
   * need not contain the inputText or outputText, this is implemented as a custom query using
   * the query builder. To include additional columns into the response, add another item
   * to the `.select` array
   * */
  findAndFilter(id: string): Promise<Problems> {
    const query = this.createQueryBuilder()
      .select([
        'problems.id',
        'problems.name',
        'problems.sampleInput',
        'problems.sampleOutput',
        'problems.maxPoints',
        'problems.windowsFileURL',
        'problems.objectFileURL',
        'problems.macFileURL',
        'problems.instructionsText',
      ])
      .from(Problems, 'problems')
      .andWhere('problems.id = :id', { id })
      .getOne();

    return query;
  }

  async findAssigned(teamId) {
    const query = await this.createQueryBuilder('problems')
      .leftJoin('problems.teams', 'teams')
      .select([
        'problems.id',
        'problems.name',
        'problems.sampleInput',
        'problems.sampleOutput',
        'problems.maxPoints',
        'problems.windowsFileURL',
        'problems.objectFileURL',
        'problems.macFileURL',
        'problems.instructionsText',
      ])
      .where('teams.id = :teamId', { teamId })
      .getMany();

    return query;
  }

  /**
   * findOneForJudge provides all the data required by [[JudgeService]] to evaluate a
   * submission. This includes the input, output and instructions in plainText format.
   * The response does not contain the downloadURLs as they are not required by the judge.
   */
  async findOneForJudge(id: string) {
    const query = await this.createQueryBuilder()
      .select([
        'problems.id',
        'problems.inputText1',
        'problems.outputText1',
        'problems.inputText2',
        'problems.outputText2',
        'problems.inputText3',
        'problems.outputText3',
        'problems.inputText4',
        'problems.outputText4',
        'problems.inputText5',
        'problems.outputText5',
        'problems.instructionsText',
        'problems.name',
        'problems.maxPoints',
      ])
      .from(Problems, 'problems')
      .andWhere('problems.id = :id', { id })
      .getOne();
    return query;
  }

  /** To get round 2 problems i.e problem name should be greater than 20 */
  async getRound2Problems() {
    const query = await this.createQueryBuilder()
      .select([
        'problems.id',
        'problems.name',
        'problems.maxPoints',
        'problems.windowsFileURL',
        'problems.objectFileURL',
        'problems.macFileURL',
        'problems.instructionsText',
      ])
      .from(Problems, 'problems')
      .getMany();
    return query;
  }

  async findLeastAssigned(difficulty) {
    const query = await this.createQueryBuilder('problems')
      .leftJoin('problems.teams', 'teams')
      .addSelect('teams')
      .where('problems.difficulty = :difficulty', { difficulty })
      .andWhere('problems.round2 = true')
      .getMany();

    return query;
  }
}
