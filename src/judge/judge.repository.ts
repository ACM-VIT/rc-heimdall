import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { JudgeSubmissions } from './judge.entity';

/**
 * **Judge Repository**
 *
 * This is the data persistence layer and is responsible for database related operations.
 *
 * @category Judge
 */
@Injectable()
export class JudgeRepository extends Repository<JudgeSubmissions> {
  constructor(@InjectRepository(JudgeSubmissions) repository: Repository<JudgeSubmissions>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  /** to fetch highest points scored by team on given problem */
  async getHighestPointsFor(problemID: string, teamID: number) {
    const query = await this.createQueryBuilder('submission')
      .leftJoinAndSelect('submission.problem', 'problem')
      .select('MAX(submission.points)', 'points')
      .andWhere('submission.teamId = :team', { team: teamID })
      .andWhere('submission.problemId = :problem', { problem: problemID })
      .getRawOne();

    return query;
  }

  async findOneWithMaxPoints(teamId: number, problemId: string) {
    const query = await this.createQueryBuilder('submission')
      .innerJoin('submission.testCase', 'testcases')
      .innerJoin('submission.problem', 'problem')
      .select('submission.points')
      .addSelect('testcases.state')
      .addSelect('testcases.testCaseNumber')
      .addSelect('problem.instructionsText')
      .addSelect('problem.windowsFileURL')
      .addSelect('problem.objectFileURL')
      .addSelect('problem.macFileURL')
      .where('submission.teamId = :team', { team: teamId })
      .andWhere('submission.problemId = :problem', { problem: problemId })
      .andWhere('submission.points = :points', { points: (await this.getHighestPointsFor(problemId, teamId)).points })
      .orderBy('submission.created_at', 'DESC')
      .limit(5)
      .getMany();
    return query;
  }

  async findTeamIdAndMaxPoints(id: number) {
    const { teamId, problemId } = await this.createQueryBuilder('submission')
      .innerJoin('submission.team', 'team')
      .innerJoin('submission.problem', 'problem')
      .select('team.id', 'teamId')
      .addSelect('problem.id', 'problemId')
      .where('submission.id = :id', { id })
      .getRawOne();

    //console.log(teamId, problemId);

    const query = await this.createQueryBuilder('submission')
      .innerJoin('submission.team', 'team')
      .innerJoin('submission.problem', 'problem')
      .select('submission.points')
      .addSelect('submission.created_at')
      .addSelect('team')
      .where('submission.teamId = :teamId', { teamId })
      .andWhere('submission.problemId = :problemId', { problemId })
      .andWhere('submission.points = :points', { points: (await this.getHighestPointsFor(problemId, teamId)).points })
      .getOne();

    return query;
  }

  //async findMaxPointsOfSameProblem(id: number)

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

  /** To fetch details of judgesubmissions from team */
  async findByTeam(team_id) {
    // show status for each testcase and problemID only
    const query = await this.createQueryBuilder('submission')
      .leftJoinAndSelect('submission.problem', 'problem')
      .groupBy('submission.problemId')
      .select('MAX(submission.points)', 'points')
      .andWhere('submission.team = :team_id', { team_id })
      .getMany();
    return query;
  }

  /** To fetch details by team and ID */
  async findOneByTeamAndID(id, team_id) {
    const query = await this.createQueryBuilder('submission')
      .leftJoin('submission.testCase', 'testcase')
      .select('submission.points')
      .addSelect('testcase.state')
      .addSelect('testcase.testCaseNumber')
      .andWhere('submission.id = :id', { id })
      .andWhere('submission.team = :team_id', { team_id })
      .getOne();
    return query;
  }
}
