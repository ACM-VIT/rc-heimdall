import { BadRequestException, forwardRef, Inject, Injectable, Logger, CACHE_MANAGER } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Judge0Callback } from './interface/judge0.interfaces';
import { TestCaseRepository } from './testCase.repository';
import { TeamsService } from '../teams/teams.service';
import { TestCase } from './testCase.entity';
import { CodeStates, DILUTE } from 'src/testCase/enum/codeStates.enum';
import { JudgeRepository } from 'src/judge/judge.repository';
import { JudgeService } from 'src/judge/judge.service';
import { Cache } from 'cache-manager';

let testCaseNumber = 0;

@Injectable()
export class TestCaseService {
  /** injecting imported modules and services into problem service */
  constructor(
    // private readonly logger = new Logger('judge'),

    // private readonly teamsService: TeamsService,
    /** injecting [[ProblemRepository]] as a persistence layer */
    @InjectRepository(TestCaseRepository)
    private readonly testCaseRepository: TestCaseRepository,

    @Inject(forwardRef(() => JudgeService))
    private readonly judgeService: JudgeService,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async handleCallback(callbackJudgeDto: Judge0Callback) {
    const { status, token }: Judge0Callback = callbackJudgeDto;
    // this.logger.setContext('judge.callback');

    /** update state of submission in database */
    const testCaseSubmission = await this.testCaseRepository.fetchDetailsByToken(token);
    let returned_testcases = await this.cacheManager.get(`judge-${testCaseSubmission.submission.id}`);
    if (returned_testcases == null) {
      await this.cacheManager.set(`judge-${testCaseSubmission.submission.id}`, 1);
    } else {
      await this.cacheManager.set(`judge-${testCaseSubmission.submission.id}`, <number>returned_testcases + 1);
    }
    console.log(testCaseSubmission);

    if (testCaseSubmission === null) {
      // this.logger.verbose(`Invalid token received ${token}`);
      throw new BadRequestException(`submission with token ${token} not found`);
    }

    testCaseSubmission.state = status.id;
    testCaseSubmission.dateUpdated = new Date();
    const judgeSubmission = testCaseSubmission.submission;
    console.log(`> ${token} :: ${DILUTE[testCaseSubmission.state]}`);

    let points = <number>await this.cacheManager.get(`judge-${testCaseSubmission.submission.id}-points`);
    points ??= 0;
    if (status.id === 3) {
      points += 20;
    }
    await this.cacheManager.set(`judge-${testCaseSubmission.submission.id}-points`, points);
    console.log(returned_testcases);
    if (returned_testcases == 4) {
      console.log('all Done');
      judgeSubmission.points = points;
      judgeSubmission.returned_testcases = 5;
      await this.judgeService.savePointsForTeam(judgeSubmission.id, judgeSubmission.points);
      await this.cacheManager.del(`judge-${testCaseSubmission.submission.id}`);
      await this.cacheManager.del(`judge-${testCaseSubmission.submission.id}-points`);
    }
    await this.testCaseRepository.save(testCaseSubmission);

    // /** assign points only to CodeStates.{ACCEPTED | WRONG} responses  */
    // const refereeEvaluation = referee(
    //   Buffer.from(stdout, 'base64').toString(),
    //   Buffer.from(testCaseSubmission.problem.outputText1, 'base64').toString(),
    //   testCaseSubmission.problem.maxPoints,
    //   testCaseSubmission.problem.multiplier,
    // );
    // this.logger.verbose(`${testCaseSubmission} got ${JSON.stringify(refereeEvaluation)}`);

    // /** save the current testCaseSubmission into database */
    // testCaseSubmission.points = refereeEvaluation.points;
    // this.logger.verbose(`> ${token} :: awarded ${refereeEvaluation.points} points`);

    // /** get the highest points for testCaseSubmission of same problem by same team */
    // const besttestCaseSubmissionTillNow = await this.judgeRepository.getHighestPointsFor(
    //   testCaseSubmission.problem.id,
    //   testCaseSubmission.team.id,
    // );
    // await testCaseSubmission.save();

    // /** handle changes regarding team points */
    // const team = await this.teamsService.findOneById(testCaseSubmission.team.id);
    // if (besttestCaseSubmissionTillNow === undefined) {
    //   team.points += testCaseSubmission.points;
    //   this.logger.verbose(`Old record not found, adding ${testCaseSubmission.points}`);
    // } else if (besttestCaseSubmissionTillNow.points < testCaseSubmission.points) {
    //   team.points += Math.abs(testCaseSubmission.points - besttestCaseSubmissionTillNow.points);
    //   this.logger.verbose(`Updating record by ${besttestCaseSubmissionTillNow.points} <= ${testCaseSubmission.points}`);
    // }
    // await team.save();

    return;
  }

  /**
   * To make testcases with tokens
   */
  async makeTestCases(data, judgeSubmission) {
    data.forEach(async (token, i) => {
      await this.testCaseRepository.save({
        token: token.token,
        state: CodeStates.IN_QUEUE,
        testCaseNumber: i + 1,
        dateCreated: new Date(),
        dateUpdated: new Date(),
        submission: judgeSubmission,
      });
    });
    return;
  }

  /**
   * To get all testcases of a submission
   */
  async getAll() {
    return await this.testCaseRepository.find();
  }

  /**
   * To delete all testcases
   */
  async clear() {
    return await this.testCaseRepository.clear();
  }
}
