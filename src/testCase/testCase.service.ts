import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Judge0Callback } from './interface/judge0.interfaces';
import { TestCaseRepository } from './testCase.repository';
import { TeamsService } from '../teams/teams.service';
import { TestCase } from './testCase.entity';
import { CodeStates } from 'src/testCase/enum/codeStates.enum';

@Injectable()
export class TestCaseService {
  /** injecting imported modules and services into problem service */
  constructor(
    // private readonly logger = new Logger('judge'),

    // private readonly teamsService: TeamsService,
    /** injecting [[ProblemRepository]] as a persistence layer */
    @InjectRepository(TestCaseRepository)
    private readonly testCaseRepository: TestCaseRepository,
  ) {}

  async handleCallback(callbackJudgeDto: Judge0Callback) {
    const { status, stdout, token }: Judge0Callback = callbackJudgeDto;
    // this.logger.setContext('judge.callback');

    /** update state of submission in database */
    const testCaseSubmission = await this.testCaseRepository.fetchDetailsByToken(token);

    if (testCaseSubmission === undefined) {
      // this.logger.verbose(`Invalid token received ${token}`);
      throw new BadRequestException(`submission with token ${token} not found`);
    }

    testCaseSubmission.state = status.id;
    testCaseSubmission.dateUpdated = new Date();
    console.log('state: ', status);
    if (status.description === 'Accepted') {
      const judgeSubmission = testCaseSubmission.submission;
      judgeSubmission.points += 20;
      await judgeSubmission.save();
    }

    await testCaseSubmission.save();

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
    const testcases = [];
    data.forEach(async (token, i) => {
      const testCase = new TestCase();
      testCase.token = token.token;
      testCase.state = CodeStates.IN_QUEUE;
      testCase.testCaseNumber = i + 1;
      testCase.dateCreated = new Date();
      testCase.dateUpdated = new Date();
      testCase.submission = judgeSubmission;
      await testCase.save();
      testcases.push(testCase);
    });
    return testcases;
  }

  /**
   * To get all testcases of a submission
   */
  async getAll() {
    return await this.testCaseRepository.find();
  }
}
