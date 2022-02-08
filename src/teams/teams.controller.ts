import {
  Controller,
  Get,
  Post,
  Request,
  Body,
  Param,
  ValidationPipe,
  UsePipes,
  UseGuards,
  UnauthorizedException,
  Delete,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './team.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AssignProblemDTO } from './dto/assign-problem.dto';
import { AssignProblemR2DTO } from './dto/assign-problem-r2.dto';
import { mapLanguageIdToObject } from '../judge/minions/language';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { JwtToken } from 'src/auth/interface/auth.token.interface';
import * as Teams from '../../config/qualifiedteams.json';
/**
 * **Teams Controller**
 *
 * All routes related to teams are declared here, and the decorators represent the type of request
 * they respond to. Use ValidationPipe to validate client requests, and the rules for validation are
 * defined in [[CreateTeamDto]].
 *
 * The controller calls [[TeamsService]] for all operations.
 *
 * @category Problems
 */
@ApiTags('Teams')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('teams')
export class TeamsController {
  /** initiate controller  */
  constructor(private readonly teamsService: TeamsService) {}

  /**
   * Responds to: _GET(`/`)_
   *
   * Get list of all [[Team]] along-with their [[JudgeSubmissions]].
   */
  @Get()
  @UsePipes(ValidationPipe)
  findAll(@Request() req) {
    const user: JwtToken = req.user;
    return this.teamsService.findOne(user.participant.team_id);
    // return [];
  }

  /**
   * Responds to: _GET(`/leader`)_
   * Get leaderBoard with team id, name and points of [[Team]]
   */
  @Get('/leader')
  leaderBoard() {
    return this.teamsService.getLeaderBoard();
  }

  /**
   * Responds to: _GET(`/problems`)_
   * Get details of problems assigned to [[Team]]
   */
  @Get('/:id/problems')
  getProblems(@Request() request, @Param('id') id: number) {
    const user: JwtToken = request.user;
    if (user.participant.team_id !== id) {
      throw new UnauthorizedException(`who art thou? eff u!`);
    }
    return this.teamsService.getAssignedProblems(id);
  }

  /**
   * Responds to: _POST(`/problems`)_
   *
   * Assign a problem to team
   */
  @Post('/problems')
  @UsePipes(ValidationPipe)
  assignProblem(@Request() req, @Body() assignProblemDTO: AssignProblemDTO) {
    const user: JwtToken = req.user;
    if (!Teams.teamIds.includes(user.participant.team_id.toString())) {
      throw new UnauthorizedException(`Team not qualified!`);
    }

    return this.teamsService.assignProblem(assignProblemDTO.problemID, user.participant.team_id);
  }

  /**
   * Responds to: _GET(`/getassignedproblems`)_
   * Get list of problems assigned to team
   */
  @Get('/getassignedproblems')
  async getAssignedProblems(@Request() request) {
    const user: JwtToken = request.user;
    console.log('user', user);
    const allowedTeams = [
      '921',
      '1903',
      '660',
      '692',
      '900',
      '745',
      '2256',
      '2147',
      '666',
      '975',
      '1942',
      '1161',
      '716',
      '865',
      '1197',
      '1259',
      '2148',
      '1983',
      '2344',
      '2343',
      '2302',
      '2245',
      '1336',
      '2356',
      '7',
      '6',
      '8',
    ];
    console.log('allowed_teams', allowedTeams);
    console.log('user.team_id', user.participant.team_id);

    if (!allowedTeams.includes(String(user.participant.team_id))) {
      throw new UnauthorizedException(`Team not qualified!`);
    }

    const assignedProblems = await this.teamsService.getAssignedProblems(user.participant.team_id);
    console.log('assigned_problems', assignedProblems);
    return assignedProblems;
  }

  /**
   * Responds to: _POST(`/assignproblems`)_
   *
   * Assign a problem to team for round 2
   */
  // @Post('/assignproblems')
  // @UsePipes(ValidationPipe)
  // assignProblemRoundTwo(@Request() request, @Body() assignProblemR2DTO: AssignProblemR2DTO) {
  //   const user: JwtToken = request.user;
  //   return this.teamsService.assignProblemRoundTwo(assignProblemR2DTO.problemID, user.participant.team_id);
  // }
  /**
   * Responds to: _GET(`/:id`)_
   * Get details of [[Team]] by ID
   */
  @Get('/getRank')
  async findOne(@Request() request) {
    const user: JwtToken = request.user;

    /** fetch all team details to display */
    const teamRank = await this.teamsService.findOneByIdWithRank(user.participant.team_id);
    return teamRank;
  }

  //   /** show only selected details from problems object */
  //   // const problems =
  //   //   teamDetails.problems != undefined
  //   //     ? teamDetails.problems.map((problem) => {
  //   //         return {
  //   //           id: problem.id,
  //   //           name: problem.name,
  //   //           maxPoints: problem.maxPoints,
  //   //           windowsFileURL: problem.windowsFileURL,
  //   //           objectFileURL: problem.objectFileURL,
  //   //           instructionsText: problem.instructionsText,
  //   //           sampleInput: problem.sampleInput,
  //   //           sampleOutput: problem.sampleOutput,
  //   //         };
  //   //       })
  //   //     : [];

  //   /** show only selected items from submissions object, nested problems */
  //   const judgeSubmissions = teamDetails.judgeSubmissions.map((submission) => {
  //     return {
  //       id: submission.id,
  //       language: mapLanguageIdToObject(submission.language).extension,
  //       // state: DILUTE[submission.state1],
  //       points: submission.points,
  //       // judge0ID: submission.judge0ID1,
  //       code: submission.code,
  //       problem: {
  //         id: submission.problem.id,
  //         name: submission.problem.name,
  //         maxPoints: submission.problem.maxPoints,
  //       },
  //     };
  //   });

  //   /** if problems array is empty (case when problems are not being assigned, assign unique problem IDs) */
  //   // let problemsList = [];
  //   // if (problems.length === 0) {
  //   //   problemsList = judgeSubmissions
  //   //     .map((submission) => submission.problem.id)
  //   //     .filter((value, index, self) => self.indexOf(value) === index)
  //   //     .map((id) => {
  //   //       return { id };
  //   //     });
  //   // }

  //   /** get best of each problem */
  //   const bestOfEachProblem = [];

  //   /** iterate and generate list of unique and maximum valued submissions */
  //   // for (
  //   //   let i = 0, maxPoints: number, localMax: number;
  //   //   i < (problems.length === 0 ? problemsList.length : problems.length);
  //   //   i += 1
  //   // ) {
  //   //   maxPoints = -1;
  //   //   localMax = -1;
  //   //   const { id } = problems.length === 0 ? problemsList[i] : problems[i];
  //   //   let problemName;
  //   //   let maxProblemPoints;

  //   //   for (let j = 0; j < judgeSubmissions.length; j += 1) {
  //   //     if (judgeSubmissions[j].problem.id === id && judgeSubmissions[j].points >= maxPoints) {
  //   //       maxPoints = judgeSubmissions[j].points;
  //   //       localMax = judgeSubmissions[j].id;
  //   //       problemName = judgeSubmissions[j].problem.name;
  //   //       maxProblemPoints = judgeSubmissions[j].problem.maxPoints;
  //   //     }
  //   //   }

  //   //   /** store in array for client response */
  //   //   bestOfEachProblem.push({
  //   //     problemID: id,
  //   //     submissionID: localMax,
  //   //     points: maxPoints,
  //   //     problemName,
  //   //     maxProblemPoints,
  //   //   });
  //   // }

  //   /** using spread operator to override the [[Team]] properties. */
  //   return { ...teamDetails, judgeSubmissions, bestOfEachProblem };
  // }

  /**
   * Responds to: _DELETE(`/`)_
   *
   * Delete all teams
   */
  // @Delete()
  // removeAll() {
  //   return this.teamsService.removeAll();
  // }
}
