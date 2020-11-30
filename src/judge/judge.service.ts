import * as config from 'config';
import { BadRequestException, Dependencies, HttpService, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateJudgeDto } from './dto/create-judge.dto';
import { UpdateJudgeDto } from './dto/update-judge.dto';
import { JudgeRepository } from './judge.repository';
import { LanguageStruct } from './interface/enums.interface';
import { mapLanguageStringToObject } from './minions/language';
import { JudgeOSubmissionRequest } from './interface/judge0.interfaces';
import { ProblemsService } from 'src/problems/problems.service';
import { TeamsService } from 'src/teams/teams.service';

@Injectable()
@Dependencies(HttpService)
export class JudgeService {
  constructor(
    private readonly http: HttpService,
    private readonly endpoint: string,
    private readonly callback: string,
    private readonly logger = new Logger('judge'),

    @InjectRepository(JudgeRepository)
    private readonly judgeRepository: JudgeRepository,

    @Inject(ProblemsService)
    private readonly problemService: ProblemsService,

    @Inject(TeamsService)
    private readonly teamService: TeamsService,
  ) {
    this.logger.verbose('service initialized');
    this.callback = config.get('judge.callback');
    this.endpoint = `${config.get('judge.endpoint')}/submissions`;
  }

  async create(createJudgeDto: CreateJudgeDto) {
    const { code, language, problemID, teamID } = createJudgeDto;

    /** map code extension to judge0 specific id */
    const codeLanguage: LanguageStruct = mapLanguageStringToObject(language);
    if (codeLanguage.id === -1) {
      throw new BadRequestException('Code language not accepted');
    }

    /** fetch question details about question */
    const problem = await this.problemService.findOne(problemID);
    if (problem === undefined) {
      throw new BadRequestException(`No problem with id:${problemID}`);
    }

    /** fetch team details to ensure that it's not a random submission */
    const team = this.teamService.findOneById(teamID);
    if (team === undefined) {
      throw new BadRequestException(`No team with id:${teamID}`);
    }

    const postBody: JudgeOSubmissionRequest = {
      source_code: code,
      language_id: codeLanguage.id,
      callback_url: this.callback,
      expected_output: problem.judgeOutput,
      stdin: problem.judgeInput,
    };

    const judge0Response = await this.http.post(this.endpoint, postBody);
    console.log(judge0Response);

    return postBody;
  }

  findAll() {
    return `This action returns all judge`;
  }

  findOne(id: number) {
    return `This action returns a #${id} judge`;
  }

  update(id: number, updateJudgeDto: UpdateJudgeDto) {
    return `This action updates a #${id} judge`;
  }

  remove(id: number) {
    return `This action removes a #${id} judge`;
  }
}

// import { BadRequestException, Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { CreateJudgeDto } from './dto/create-judge.dto';
// import { UpdateJudgeDto } from './dto/update-judge.dto';
// import { JudgeRepository } from './judge.repository';
// import { JudgeOSubmissionRequest } from './interface/judge0.interfaces';
// import { LanguageStruct } from './interface/enums.interface';
// import { mapLanguageStringToObject } from './minions/language';
// import * as config from 'config';

// //   constructor(
//     private readonly endpoint: string,
//     private readonly callback: string,

//     @InjectRepository(JudgeRepository)
//     private readonly judgeRepository: JudgeRepository,
//   ) {
//     this.callback = config.get('judge.callback');
//     this.endpoint = `${config.get('judge.endpoint')}/submissions`;
//   }

//
