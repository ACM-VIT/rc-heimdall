import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { AssignProblemDTO } from './dto/assign-problem.dto';
import { AssignProblemR2DTO } from './dto/assign-problem-r2.dto';
import { Team } from './team.entity';
import { TeamRepository } from './teams.repository';
import * as config from 'config';
import { ProblemsService } from '../problems/problems.service';
import { Problems } from '../problems/problem.entity';
import * as Teams from '../../config/qualifiedteams.json';

const qualifiedTeams = ['2148', '1983', '2344', '2343', '2302', '2245', '1336', '2356', '646', '874'];

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
  async findOne(id: number) {
    const response = await this.teamRepository.findWithParticipants(id);
    if (response === undefined) {
      return undefined;
    }
    return response;
  }

  /**
   * To get list of [[Problems]] assigned to particular [[Team]]
   */
  async getAssignedProblems(id: number) {
    if (config.get('application.assignProblemToTeams') === true) {
      try {
        const team = await this.teamRepository.find({ id });
        const problems = team[0].problems;
        const assignedProblems = [];
        problems.map((problem) => {
          const assignedProblem = problem;
          const trimProblem = {
            id: assignedProblem.id,
            name: assignedProblem.name,
            maxPoints: assignedProblem.maxPoints,
            description: assignedProblem.instructionsText,
            sampleInput: assignedProblem.sampleInput,
            sampleOutput: assignedProblem.sampleOutput,
            windowsFileURL: assignedProblem.windowsFileURL,
            objectFileURL: assignedProblem.objectFileURL,
            macFileURL: assignedProblem.macFileURL,
          };
          assignedProblems.push(trimProblem);
        });
        // sort assigned problems based on name
        const sortedProblems = assignedProblems.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
        return sortedProblems;
      } catch (e) {
        console.log(e);
        throw new NotFoundException(`No Problems assigned to this team`);
      }
    } else {
      return [];
    }
  }

  /**
   * To fetch details of [[Team]] by [[Team.id]]
   */
  async findOneById(id: number) {
    const teamData = await this.teamRepository.findOne({ id });
    return teamData;
  }
  /**
   * To fetch details of [[Team]] by [[Team.id]]
   */
  async findOneByIdWithRank(id: number) {
    const teamData = await this.teamRepository.findOne(id);
    const allRanks = await this.teamRepository.getLeaderBoard();
    const teamRank = allRanks.findIndex((team) => team.id == id) + 1;

    return { ...teamData, rank: teamRank };
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
    const allRanks = await this.teamRepository.getLeaderBoard();
    // remove teams with certain IDs
    const filteredRanks = allRanks.filter((team) => {
      if (qualifiedTeams.includes(team.id.toString())) {
        return team;
      }
    });

    // sort teams based on timestamp
    const sortedByPoints = filteredRanks.sort((a, b) => {
      if (b.pointsR2 - a.pointsR2 !== 0) {
        return b.pointsR2 - a.pointsR2;
      }

      const aTime = (new Date(a.timestamp) as unknown) as number;
      const bTime = (new Date(b.timestamp) as unknown) as number;
      return bTime - aTime;
    });

    // add ranks to each team
    const teamsWithRanks = sortedByPoints.map((team, index) => {
      return { rank: index + 1, ...team };
    });
    return teamsWithRanks;
  }

  /**
   * To assign a [[Problem]] to [[Team]]
   */
  async assignProblem(problemID, teamID) {
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
    /** Check if team is already assigned with 10 problems */
    console.log('problems already assigned: ', team.problems);
    if (team.problems.length >= 10) {
      throw new NotFoundException(`Team already has 10 problems assigned`);
    }
    /** attach problem into team, operate on points */
    team.problems.forEach((prob) => {
      if (prob.id === problemID) {
        throw new NotFoundException(`Problem already assigned to team`);
      }
    });

    team.problems.push(problem);

    await this.teamRepository.save(team);

    return { ...problem };
  }

  /**
   * To assign a [[Problem]] to [[Team]] for round 2
   */
  async assignProblemRoundTwo(problemID, teamID): Promise<{ problems: Array<Problems> }> {
    /** fetch problem by problem ID */
    const problem = await this.problemService.findOne(problemID);
    if (problem === undefined) {
      throw new NotFoundException(`Problem with ID:${problemID} does not exist`);
    }

    console.log('problem', problem);
    /** fetch team by teamID */
    const team = await this.teamRepository.findOne(teamID);
    if (team === undefined) {
      throw new NotFoundException(`Team with ID: ${teamID} does not exist`);
    }

    /** attach problem into team, operate on points */
    team.problems.push(problem);
    return await team.save();
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

  /**
   * To remove all teams
   */
  removeAll() {
    return this.teamRepository.removeAll();
  }
}
