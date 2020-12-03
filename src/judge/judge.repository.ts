import { EntityRepository, Repository } from 'typeorm';

import { JudgeSubmissions } from './judge.entity';

/**
 * **Judge Repository**
 *
 * This is the data persistence layer and is responsible for database related operations.
 *
 * @category Judge
 */
@EntityRepository(JudgeSubmissions)
export class JudgeRepository extends Repository<JudgeSubmissions> {
  /** to fetch submission details by Judge0 Token */
  async fetchDetailsByJudge0Token(token: string) {
    const query = this.createQueryBuilder('submission')
      .andWhere('submission.judge0ID = :token', { token })
      .leftJoinAndSelect('submission.problem', 'problems')
      .leftJoinAndSelect('submission.team', 'team')
      .getOne();

    return query;
  }

  /** to fetch highest points scored by team on given problem */
  async getHighestPointsFor(problemID: string, teamID: number) {
    const query = await this.createQueryBuilder('submission')
      .select('MAX(submission.points)', 'points')
      .andWhere('submission.teamId = :team', { team: teamID })
      .andWhere('submission.problemId = :problem', { problem: problemID })
      .getRawOne();

    return query;
  }

  /** to fetch selected details of submission for client / participant */
  async findOneForClientByJudge0Token(token: string) {
    const query = await this.createQueryBuilder('submission')
      .select('submission.id')
      .addSelect('submission.language')
      .addSelect('submission.state')
      .addSelect('submission.points')
      .addSelect('submission.judge0ID')
      .andWhere('submission.judge0ID = :token', { token })
      .getOne();

    return query;
  }
}
