import { EntityRepository, Repository } from 'typeorm';

import { JudgeSubmissions } from './judge.entity';

@EntityRepository(JudgeSubmissions)
export class JudgeRepository extends Repository<JudgeSubmissions> {
  async fetchDetailsByJudge0Token(token: string) {
    const query = this.createQueryBuilder('submission')
      .andWhere('submission.judge0ID = :token', { token })
      .leftJoinAndSelect('submission.problem', 'problems')
      .leftJoinAndSelect('submission.team', 'team')
      .getOne();

    return query;
  }

  async getHighestPointsFor(problemID: string, teamID: number) {
    const query = await this.createQueryBuilder('submission')
      .select('MAX(submission.points)', 'points')
      .andWhere('submission.teamId = :team', { team: teamID })
      .andWhere('submission.problemId = :problem', { problem: problemID })
      .getRawOne();

    return query;
  }
}
