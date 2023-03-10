import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JudgeService } from 'src/judge/judge.service';
import { MoreThanOrEqual } from 'typeorm';
import { CreateProblemDto } from './dto/create-problem.dto';
import { ProblemRepository } from './problems.repository';

/**
 * **Problems Service**
 *
 * Problems Service contains all business logic related to problems, and is designed to be
 * imported and re-used in other modules. Therefore it is to ensure that all methods of the service
 * are self-contained and fit to be used directly as per use-case.
 *
 * @category Problems
 */
@Injectable()
export class ProblemsService {
  /** injecting imported modules and services into problem service */
  constructor(
    /** injecting [[ProblemRepository]] as a persistence layer */
    @InjectRepository(ProblemRepository)
    private readonly problemRepository: ProblemRepository,

    @Inject(forwardRef(() => JudgeService))
    private readonly judgeService: JudgeService,
  ) {}

  /** to create a new problem entry in databases based on data provided by [[CreateProblemDto]]  */
  create(createProblemDto: CreateProblemDto) {
    return this.problemRepository.save(createProblemDto);
  }

  /** to return list of all problems */
  async findAll() {
    const problems = await this.problemRepository.find();
    // dont show sensitive data like input and output texts
    const refinedProblems = problems.map((problem) => {
      return {
        id: problem.id,
        name: problem.name,
        sampleInput: problem.sampleInput,
        sampleOutput: problem.sampleOutput,
        maxPoints: problem.maxPoints,
        windowsFileURL: problem.windowsFileURL,
        objectFileURL: problem.objectFileURL,
        macFileURL: problem.macFileURL,
        instructionsText: problem.instructionsText,
      };
    });

    // sort refinedProblem with name
    refinedProblems.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    return refinedProblems;
  }

  /**
   * to fetch details of a particular problem based on its uuid. Internally this calls the
   * [[findAndFilter]] method of [[ProblemRepository]] to hide sensitive details of the problem
   */
  async findOne(id: string) {
    try {
      const problem = await this.problemRepository.findAndFilter(id);
      return problem;
    } catch (e) {
      throw new NotFoundException(`Invalid QuestionID :${id}`);
    }
  }

  async getProblem(teamId: number, id: string) {
    try {
      const submission = await this.judgeService.findOneWithMaxPoints(teamId, id);
      if (submission.length === 0) {
        const problem = await this.problemRepository.findOne({
          where: { id },
          select: { windowsFileURL: true, objectFileURL: true, macFileURL: true, instructionsText: true },
        });
        return {problem};
      }
      return submission[0];
    } catch (err) {
      return err;
    }
  }

  /**
   * to fetch human readable name of a given problem by given uuid. This is used while calling the
   * task runner as the client operates on uuid and task-runner operates on readable names.
   */
  async getNameFromId(id: string): Promise<string> {
    try {
      const problem = await this.problemRepository.findOneBy({ id });
      return problem.name;
    } catch (e) {
      throw new NotFoundException(`No Problems found with given id ${id}`);
    }
  }

  /**
   * to fetch human readable name of a given problem by given uuid. This is used while calling the
   * task runner as the client operates on uuid and task-runner operates on readable names.
   */
  async getNameDescriptionFromId(id: string) {
    try {
      const problem = await this.problemRepository.findOneBy({ id });
      return { problem_name: problem.name, description: problem.instructionsText };
    } catch (e) {
      throw new NotFoundException(`No Problems found with given id ${id}`);
    }
  }

  /** To get problem ID's for all problems */
  async getProblemIDs() {
    const problemIDs = await this.problemRepository.find();
    // filter with problem_name>15
    const refinedProblems = problemIDs.filter((problem) => {
      return problem.name > '15';
    });
    return refinedProblems.map((problem) => {
      return problem.id;
    });
  }

  /**
   * to fetch details of a particular problem to judge the submission. This is different from
   * [[findAndFilter]] as this returns inputText and outputText as well, and does not include
   * download links.
   */
  async findOneForJudge(id: string) {
    try {
      const problem = await this.problemRepository.findOneForJudge(id);
      return problem;
    } catch (e) {
      throw new BadRequestException(`Invalid QuestionID :${id}`);
    }
  }

  /** to delete a problem by uuid */
  remove(id: string) {
    return this.problemRepository.delete({ id });
  }

  /** to get round 2 problems */
  async getRound2() {
    const problems = await this.problemRepository.getRound2Problems();
    // get problems only if its name is >"20"
    const refinedProblems = problems.filter((problem) => {
      return problem.name > '15';
    });

    // sort refinedProblem with name
    refinedProblems.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    return refinedProblems;
  }

  /** clea */
  // /** critical function, to clear/delete/remove all problems in storage */
  clear() {
    return this.problemRepository.delete({ maxPoints: MoreThanOrEqual(0) });
  }
}
