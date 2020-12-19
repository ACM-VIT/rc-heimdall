import * as config from 'config';
import { ProblemsService } from '../problems/problems.service';
import { TeamsService } from '../teams/teams.service';

import {
  BadRequestException,
  Dependencies,
  ForbiddenException,
  HttpService,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CallbackJudgeDto } from './dto/callback-judge.dto';
import { CreateJudgeDto } from './dto/create-judge.dto';
import { UpdateJudgeDto } from './dto/update-judge.dto';
import { CODE_STATES, CodeStates } from './enum/codeStates.enum';
import { LanguageStruct } from './interface/enums.interface';
import { Judge0Callback, JudgeOSubmissionRequest } from './interface/judge0.interfaces';
import { JudgeRepository } from './judge.repository';
import { mapLanguageStringToObject } from './minions/language';
import { referee } from './minions/referee';
import { NotEquals } from 'class-validator';
import { MoreThanOrEqual } from 'typeorm';

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
    this.endpoint = `${config.get('judge.endpoint')}/submissions?base64_encoded=true`;
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
    this.logger.setContext(`judge.create.team.${teamID}`);
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
      throw new ForbiddenException(`Everything comes at a cost, you need to buy the problem`);
    }

    /** prepare postBody to send to Judge0  */
    const postBody: JudgeOSubmissionRequest = {
      source_code: code,
      language_id: codeLanguage.id,
      callback_url: this.callbackURL,
      expected_output: problem.outputText,
      stdin: problem.inputText,
    };
    this.logger.verbose(`sending to judge0 ${JSON.stringify({ ...postBody, source_code: 'code...' })}`);

    /** make http request and receive response.data. Judge0 returns a uuid for the submission made */
    const { data } = await this.http.post(this.endpoint, postBody).toPromise();
    const judge0ID = data.token;
    this.logger.verbose(`made submission, judge0 token ${judge0ID}`);

    /** persist the submission details */
    await this.judgeRepository.save({
      problem,
      team,
      language: codeLanguage.id,
      state: CodeStates.IN_QUEUE,
      points: 0,
      judge0ID,
      code,
    });
    this.logger.verbose(` submission saved into database`);

    /** return submission details back to client with Judge0 token to ping for results */
    return { submissionToken: judge0ID };
  }

  /**
   * **Judge0 Callback Handler**
   *
   * This method handles the callback from Judge0 that is sent when the submission is processed. The
   * structure of the response is represented by [[Judge0Callback]] and validated using [[CallbackJudgeDto]].
   *
   * **Flow**
   * - Fetch details of submission using Judge0Token via [[JudgeRepository.fetchDetailsByJudge0Token]]
   * - Map response ID to [[CodeStates]]
   * - Evaluate participant output to actual output using [[referee]]
   * - Fetch highest points for the same problem scored by team, increment the difference of current submission
   * points and last highest submission
   */
  async handleCallback(callbackJudgeDto: Judge0Callback) {
    const { status, stdout, token }: Judge0Callback = callbackJudgeDto;
    this.logger.setContext('judge.callback');

    /** update state of submission in database */
    const submission = await this.judgeRepository.fetchDetailsByJudge0Token(token);
    if (submission === undefined) {
      this.logger.verbose(`Invalid token received ${token}`);
      throw new BadRequestException(`submission with token ${token} not found`);
    }

    /** update code state in database */
    submission.state = status.id;
    await submission.save();

    /** map submission status into enum */
    // const codeStatus = CODE_STATES[status.id];

    // @depreciated, remove
    // if (codeStatus !== CodeStates.WRONG && codeStatus !== CodeStates.ACCEPTED) {
    //   this.logger.verbose(`received response ${status.id} not expected`);
    //   return { error: false };
    // }

    /** assign points only to CodeStates.{ACCEPTED | WRONG} responses  */
    const refereeEvaluation = referee(
      Buffer.from(stdout, 'base64').toString(),
      Buffer.from(submission.problem.outputText, 'base64').toString(),
      submission.problem.maxPoints,
      submission.problem.multiplier,
    );
    this.logger.verbose(`${submission.judge0ID} got ${JSON.stringify(refereeEvaluation)}`);

    /** save the current submission into database */
    submission.points = refereeEvaluation.points;
    this.logger.verbose(`> ${token} :: awarded ${refereeEvaluation.points} points`);

    /** get the highest points for submission of same problem by same team */
    const bestSubmissionTillNow = await this.judgeRepository.getHighestPointsFor(
      submission.problem.id,
      submission.team.id,
    );
    await submission.save();

    /** handle changes regarding team points */
    const team = await this.teamService.findOneById(submission.team.id);
    if (bestSubmissionTillNow === undefined) {
      team.points += submission.points;
      this.logger.verbose(`Old record not found, adding ${submission.points}`);
    } else if (bestSubmissionTillNow.points < submission.points) {
      team.points += Math.abs(submission.points - bestSubmissionTillNow.points);
      this.logger.verbose(`Updating record by ${bestSubmissionTillNow.points} <= ${submission.points}`);
    }
    await team.save();

    return;
  }

  /** To find details of all submission made */
  findAll() {
    return this.judgeRepository.find();
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
