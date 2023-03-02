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
  HttpService,
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
import * as qualifiedTeams from '../../config/qualifiedteams.json';
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
  constructor(private readonly teamsService: TeamsService, private readonly http: HttpService) {}

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
    if (!qualifiedTeams.teamIds.includes(user.participant.team_id.toString())) {
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
    const allowedTeams = qualifiedTeams.teamIds;
    //         maxPoints: submission.problem.maxPoints,
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
}
