import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { AssignProblemDTO } from './dto/assign-problem.dto';
import { Team } from './team.entity';
import { TeamRepository } from './teams.repository';
import * as config from 'config';
import { ProblemsService } from 'src/problems/problems.service';
import { Problems } from 'src/problems/problem.entity';

/**
 * **Teams Service**
 *
 * teams Service contains all business logic related to teams, and is designed to be
 * imported and re-used in other modules. Therefore it is to ensure that all methods of the service
 * are self-contained and fit to be used directly as per use-case.
 *
 * @category Teams
 */
@Injectable()
export class TeamsService {
  /** initialize logger with context:teams */
  private readonly logger = new Logger('teams');

  constructor(
    /** inject [[TeamRepository]] as persistence layer */
    @InjectRepository(TeamRepository)
    private teamRepository: TeamRepository,

    @Inject(ProblemsService)
    private problemService: ProblemsService,
  ) {
    this.logger.verbose('service initialized');
    this.logger.verbose(`Assigning Questions to teams : ${config.get('application.assignProblemToTeams')}`);
  }

  /**
   * To Create a new team using [[CreateTeamDto]]
   */
  create(createTeamDto: CreateTeamDto): Promise<Team> {
    return this.teamRepository.createWithJoins(createTeamDto);
  }

  /**
   * To list details of all [[Team]]
   */
  findAll() {
    return this.teamRepository.find();
  }

  /**
   * To fetch details of [[Team]] by [[Team.name]]
   */
  async findOne(name: string) {
    const response = await this.teamRepository.find({ name });
    if (response.length === 0) {
      return undefined;
    }
    return response[0];
  }

  /**
   * To fetch details of [[Team]] by [[Team.id]]
   */
  async findOneById(id: number) {
    return this.teamRepository.findOne(id);
  }

  /**
   * To delete a [[Team]] by [[Team.id]]
   */
  remove(id: number) {
    return this.teamRepository.delete({ id });
  }

  /**
   * To get leaderBoard of [[Team]] based on [[Team.points]]
   */
  async getLeaderBoard() {
    return this.teamRepository.getLoaderBoard();
  }

  /**
   * To assign a [[Problem]] to [[Team]]
   */
  async assignProblem(assignProblemDto: AssignProblemDTO): Promise<Array<Problems>> {
    const { problemID, teamID } = assignProblemDto;

    /** fetch problem by problem ID */
    const problem = await this.problemService.findOne(problemID);
    if (problem === undefined) {
      throw new NotFoundException(`Problem with ID:${problemID} does not exist`);
    }

    /** fetch team by teamID */
    const team = await this.teamRepository.findOne(teamID);
    if (team === undefined) {
      throw new NotFoundException(`Team with ID: ${teamID} does not exist`);
    }

    /** attach problem into team */
    team.problems.push(problem);
    await team.save();

    return team.problems;
  }

  /**
   * To get list of [[Problems]] assigned to particular [[Team]]
   */
  async getAssignedProblems(id: number) {
    if (config.get('application.assignProblemToTeams') === true) {
      /**
       * @todo : shift this logic to repository
       */
      const { problems } = await this.teamRepository.getAssignedProblems(id);
      const filteredResult = problems.map((problem) => {
        return {
          id: problem.id,
          maxPoints: problem.maxPoints,
          instructionsText: problem.instructionsText,
        };
      });
      return filteredResult;
    } else {
      return [];
    }
  }

  /**
   * To check if given [[Problem]] is assigned to [[Team]]
   */
  async isProblemAssignedTo(team: Team, problem: Problems): Promise<boolean> {
    /** if  assignProblemToTeams is true, then check if problem exists, else return true directly */
    if (config.get('application.assignProblemToTeams') === true) {
      const { problems } = team;
      for (let i = 0; i < problems.length; i += 1) {
        if (problems[i].id === problem.id) {
          this.logger.verbose(`${team.name} has ${problem.name}/${problem.id} assigned ? : ${true}`);
          return true;
        }
      }
      return false;
    } else {
      return true;
    }
  }
}
