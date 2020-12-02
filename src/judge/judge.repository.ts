import { EntityRepository, Repository } from 'typeorm';
import { JudgeSubmissions } from './judge.entity';

@EntityRepository(JudgeSubmissions)
export class JudgeRepository extends Repository<JudgeSubmissions> {
  async fetchDetailsByJudge0Token(token: string) {
    const query = this.createQueryBuilder('submission')
      .andWhere('submission.judge0ID = :token', { token })
      .getOne();

    return query;
  }
}
