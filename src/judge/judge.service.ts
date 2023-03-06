import * as config from 'config';
import { ProblemsService } from '../problems/problems.service';
import { TeamsService } from '../teams/teams.service';
import { TestCase } from 'src/testCase/testCase.entity';

import {
  BadRequestException,
  Dependencies,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateJudgeDto } from './dto/create-judge.dto';
import { UpdateJudgeDto } from './dto/update-judge.dto';
import { LanguageStruct } from './interface/enums.interface';
import { JudgeOSubmissionRequest } from './interface/judge0.interfaces';
import { JudgeRepository } from './judge.repository';
import { mapLanguageStringToObject } from './minions/language';
import { MoreThanOrEqual } from 'typeorm';
import { TestCaseService } from 'src/testCase/testCase.service';
// import { TestCaseService } from 'src/testCase/testCase.service';
/**
 * **Judge Service**
 *
 * Judge Service contains all business logic related to judge submissions, and is designed to be
 * imported and re-used in other modules. Therefore it is to ensure that all methods of the service
 * are self-contained and fit to be used directly as per use-case.
 *
 * @category Judge
 */
@Injectable()
@Dependencies(HttpService)
export class JudgeService {
  constructor(
    /** [[HttpService]] to make HTTP calls to judge0 endpoint */
    private readonly http: HttpService,

    /** endpoints to make api calls */
    private readonly endpoint: string,
    private readonly callbackURL: string,

    /** initiate logger with context:`judge` */
    private readonly logger = new Logger('judge'),

    /** injecting [[TestCasesService]] to perform operations on TestCases */
    @Inject(TestCaseService)
    private readonly testCaseService: TestCaseService,

    /** injecting [[JudgeRepository]] as a persistence layer */
    @InjectRepository(JudgeRepository)
    private readonly judgeRepository: JudgeRepository,

    /** injecting [[ProblemsService]] to perform operations on Problems */
    @Inject(ProblemsService)
    private readonly problemService: ProblemsService,

    /** injecting [[TeamsService]] to perform operations on Teams */
    @Inject(TeamsService)
    private readonly teamService: TeamsService,
  ) {
    this.logger.verbose('service initialized');
    this.callbackURL = config.get('judge.callback');
    this.endpoint = `${config.get('judge.endpoint')}/submissions/batch?base64_encoded=true`;
  }

  /**
   * **Judge0 Submission Maker**
   *
   * To create a new Judge0 submission based on validated data provided by [[CreateJudgeDto]]. Internally
   * this is the flow of operations to make a submission.
   *
   * **Flow**
   * - Map string representing submission to object which contains strict representation of language
   * - Fetch details of the question for which the submission is made
   * - Fetch details of the team who made the submission
   * - Prepare a [[JudgeOSubmissionRequest]] object to send to Judge0
   * - Make API call to Judge0 Endpoint and receive uuid token for made submission
   * - Persist the response from Judge0 into [[JudgeRepository]]
   * - Return submission details back to client with Judge0 token to ping for results
   */
  async create(createJudgeDto: CreateJudgeDto) {
    const { code, language, problemID, teamID } = createJudgeDto;
    //this.logger.setContext(`judge.create.team.${teamID}`);

    /**
     * Check if code size is less than 5KB
     */
    if (code.length > 5000) {
      throw new BadRequestException('Code size is more than 5KB');
    }

    /**
     * Map string representing submission to object which contains strict representation of language
     */
    const codeLanguage: LanguageStruct = mapLanguageStringToObject(language);
    if (codeLanguage.id === -1) {
      this.logger.verbose(`sent code in unacceptable language`);
      throw new BadRequestException('Code language not accepted');
    }

    /** fetch question details about question for which the submission is made */
    const problem = await this.problemService.findOneForJudge(problemID);
    if (problem === undefined) {
      this.logger.verbose(`sent invalid problem id ${problemID}`);
      throw new BadRequestException(`No problem with id:${problemID}`);
    }

    /** fetch details of the team who made the submission */
    const team = await this.teamService.findOneById(teamID);
    if (team === undefined) {
      this.logger.verbose(`is an invalid team ID`);
      throw new BadRequestException(`No team with id:${teamID}`);
    }

    /** only allow assigned teams to run problems */
    const isAssigned = await this.teamService.isProblemAssignedTo(team, problem);
    if (isAssigned === false) {
      throw new ForbiddenException(`You are not assigned with this problem`);
    }

    /** prepare postBody to send to Judge0  */
    const postBody1: JudgeOSubmissionRequest = {
      source_code: code,
      language_id: codeLanguage.id,
      callback_url: this.callbackURL,
      expected_output: Buffer.from(problem.outputText1, 'binary').toString('base64'),
      stdin: Buffer.from(problem.inputText1, 'binary').toString('base64'),
    };
    const postBody2: JudgeOSubmissionRequest = {
      source_code: code,
      language_id: codeLanguage.id,
      callback_url: this.callbackURL,
      expected_output: Buffer.from(problem.outputText2, 'binary').toString('base64'),
      stdin: Buffer.from(problem.inputText2, 'binary').toString('base64'),
    };
    const postBody3: JudgeOSubmissionRequest = {
      source_code: code,
      language_id: codeLanguage.id,
      callback_url: this.callbackURL,
      expected_output: Buffer.from(problem.outputText3, 'binary').toString('base64'),
      stdin: Buffer.from(problem.inputText3, 'binary').toString('base64'),
    };
    const postBody4: JudgeOSubmissionRequest = {
      source_code: code,
      language_id: codeLanguage.id,
      callback_url: this.callbackURL,
      expected_output: Buffer.from(problem.outputText4, 'binary').toString('base64'),
      stdin: Buffer.from(problem.inputText4, 'binary').toString('base64'),
    };
    const postBody5: JudgeOSubmissionRequest = {
      source_code: code,
      language_id: codeLanguage.id,
      callback_url: this.callbackURL,
      expected_output: Buffer.from(problem.outputText5, 'binary').toString('base64'),
      stdin: Buffer.from(problem.inputText5, 'binary').toString('base64'),
    };
    // this.logger.verbose(`sending to judge0 ${JSON.stringify({ source_code: 'code...' })}`);

    /** make http request and receive response.data. Judge0 returns a uuid for the submission made */
    const body = {
      submissions: [postBody1, postBody2, postBody3, postBody4, postBody5],
    };
    const { data } = await this.http.post(this.endpoint, body).toPromise();
    // console.log(data);

    this.logger.verbose(`made submission, judge0 token`);

    /** persist the submission details */
    const judgeSubmission = await this.judgeRepository.save({
      problem,
      team,
      language: codeLanguage.id,
      points: 0,
      code,
    });
    this.logger.verbose(` submission saved into database`);

    await this.testCaseService.makeTestCases(data, judgeSubmission);

    /** return submission details back to client with Judge0 token to ping for results */
    return judgeSubmission.id;
  }

  /** To find details of all submission made */
  async findWithTeamID(team_id) {
    // problem ids of all problems
    const top_submissions = [];
    const problem_ids = await this.problemService.getProblemIDs();
    for (let i = 0; i < problem_ids.length; i++) {
      const problem_id = problem_ids[i];
      const highest = await this.judgeRepository.getHighestPointsFor(problem_id, team_id);
      highest.problem_id = problem_id;
      const problem = await this.problemService.getNameDescriptionFromId(problem_id);
      highest.problem_name = problem.problem_name;
      highest.instructionsText = problem.description;
      top_submissions.push(highest);
    }
    // get team and update the points
    const team = await this.teamService.findOneById(team_id);
    const points = top_submissions.reduce((acc, curr) => acc + curr.points, 0);
    if (team.pointsR2 < points) {
      team.timestamp = new Date();
      team.pointsR2 = points;
    }
    await team.save();
    return top_submissions;
  }

  /** To find details of all assigned submissions */
  async findAssignedSubmissions(team_id) {
    // problem ids of all problems
    const top_submissions = [];
    const problems = await this.teamService.getAssignedProblems(team_id);
    const problem_ids = [];
    problems.map((problem) => problem_ids.push(problem.id));
    for (let i = 0; i < problem_ids.length; i++) {
      const problem_id = problem_ids[i];
      const highest = await this.judgeRepository.getHighestPointsFor(problem_id, team_id);
      highest.problem_id = problem_id;
      const problem = await this.problemService.getNameDescriptionFromId(problem_id);
      highest.problem_name = problem.problem_name;
      highest.instructionsText = problem.description;
      top_submissions.push(highest);
    }
    // get team and update the points
    const team = await this.teamService.findOneById(team_id);
    const points = top_submissions.reduce((acc, curr) => acc + curr.points, 0);
    if (team.pointsR2 < points) {
      team.timestamp = new Date();
      team.pointsR2 = points;
    }
    await team.save();
    return top_submissions;
  }

  /**
   * To fetch details of submission made by Judge0 Token.
   *
   * The client pings the server with Judge0 token received after making a submission. This method
   * fetches the submission details details based on this token and returns them to client.
   */
  async findOne(id: string) {
    const query = await this.judgeRepository.findOneForClientByJudge0Token(id);
    if (query === undefined) {
      throw new NotFoundException(`No submission for token ${id}`);
    }
    return query;
  }

  /** To fetch details by team and ID */
  async findOneByTeamAndID(id, team_id) {
    const judgeSubmission = await this.judgeRepository.findOneByTeamAndID(id, team_id);
    let points = 0;
    judgeSubmission.testCase.map((testCase) => {
      if (testCase.state === 3) {
        points += 20;
      }
      if (testCase.state >= 3) {
        judgeSubmission.returned_testcases += 1;
      }
    });
    judgeSubmission.points = points;
    await this.judgeRepository.save(judgeSubmission);
    if (judgeSubmission === undefined) {
      throw new NotFoundException(`No submission for token ${id}`);
    }
    return judgeSubmission;
  }

  /**
   * not exposed to api, provisioned for internal use only
   * @ignore
   */
  update(id: number, updateJudgeDto: UpdateJudgeDto) {
    return updateJudgeDto;
  }

  /**
   * not exposed to api, provisioned for internal use only
   * @ignore
   */
  remove(id: number) {
    return `This action removes a #${id} judge`;
  }

  /**
   * to clear entire storage
   */
  clear() {
    return this.judgeRepository.delete({ points: MoreThanOrEqual(0) });
  }
}
