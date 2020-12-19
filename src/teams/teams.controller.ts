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
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './team.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AssignProblemDTO } from './dto/assign-problem.dto';
import { DILUTE } from '../judge/enum/codeStates.enum';
import { mapLanguageIdToObject } from '../judge/minions/language';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { JwtToken } from 'src/auth/interface/auth.token.interface';

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
   * Responds to: _POST(`/`)_
   *
   * To Create a new team based on [[CreateTeamDto]]
   */
  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createTeamDto: CreateTeamDto): Promise<Team> {
    return this.teamsService.create(createTeamDto);
  }

  /**
   * Responds to: _GET(`/`)_
   *
   * Get list of all [[Team]] along-with their [[JudgeSubmissions]].
   */
  @Get()
  findAll() {
    // return this.teamsService.findAll();
    return [];
  }

  /**
   * Responds to: _GET(`/leader`)_
   *
   * Get leaderBoard with team id, name and points of [[Team]]
   */
  @Get('/leader')
  leaderBoard() {
    return this.teamsService.getLeaderBoard();
  }

  /**
   * Responds to: _GET(`/problems`)_
   *
   * Get details of problems assigned to [[Team]]
   */
  @Get('/:id/problems')
  getProblems(@Request() request, @Param('id') id: number) {
    const user: JwtToken = request.user;
    if (user.team.id !== id) {
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
  assignProblem(@Body() assignProblemDTO: AssignProblemDTO) {
    return this.teamsService.assignProblem(assignProblemDTO);
  }

  /**
   * Responds to: _GET(`/:id`)_
   *
   * Get details of [[Team]] by ID
   */
  @Get(':id')
  async findOne(@Request() request, @Param('id') id: number) {
    const user: JwtToken = request.user;
    if (user.team.id != id) {
      throw new UnauthorizedException(`Not your team`);
    }
    /** fetch all team details to display */
    const teamDetails = await this.teamsService.findOneByIdWithRank(id);

    /** show only selected details from problems object */
    const problems =
      teamDetails.problems != undefined
        ? teamDetails.problems.map((problem) => {
            return {
              id: problem.id,
              name: problem.name,
              maxPoints: problem.maxPoints,
              windowsFileURL: problem.windowsFileURL,
              objectFileURL: problem.objectFileURL,
              instructionsText: problem.instructionsText,
            };
          })
        : [];

    /** show only selected items from submissions object, nested problems */
    const judgeSubmissions = teamDetails.judgeSubmissions.map((submission) => {
      return {
        id: submission.id,
        language: mapLanguageIdToObject(submission.language).extension,
        state: DILUTE[submission.state],
        points: submission.points,
        judge0ID: submission.judge0ID,
        code: submission.code,
        problem: {
          id: submission.problem.id,
          name: submission.problem.name,
          maxPoints: submission.problem.maxPoints,
        },
      };
    });

    /** if problems array is empty (case when problems are not being assigned, assign unique problem IDs) */
    let problemsList = [];
    if (problems.length === 0) {
      problemsList = judgeSubmissions
        .map((submission) => submission.problem.id)
        .filter((value, index, self) => self.indexOf(value) === index)
        .map((id) => {
          return { id };
        });
    }

    /** get best of each problem */
    const bestOfEachProblem = [];

    /** iterate and generate list of unique and maximum valued submissions */
    for (
      let i = 0, maxPoints: number, localMax: number;
      i < (problems.length === 0 ? problemsList.length : problems.length);
      i += 1
    ) {
      maxPoints = -1;
      localMax = -1;
      const { id } = problems.length === 0 ? problemsList[i] : problems[i];
      let problemName;
      let maxProblemPoints;

      for (let j = 0; j < judgeSubmissions.length; j += 1) {
        if (judgeSubmissions[j].problem.id === id && judgeSubmissions[j].points >= maxPoints) {
          maxPoints = judgeSubmissions[j].points;
          localMax = judgeSubmissions[j].id;
          problemName = judgeSubmissions[j].problem.name;
          maxProblemPoints = judgeSubmissions[j].problem.maxPoints;
        }
      }

      /** store in array for client response */
      bestOfEachProblem.push({
        problemID: id,
        submissionID: localMax,
        points: maxPoints,
        problemName,
        maxProblemPoints,
      });
    }

    /** using spread operator to override the [[Team]] properties. */
    return { ...teamDetails, problems, judgeSubmissions, bestOfEachProblem };
  }

  /**
   * Responds to: _DELETE(`/:id`)_
   *
   * Delete a team by id
   */
  //   @Delete(':id')
  //   remove(@Param('id') id: string) {
  //     return this.teamsService.remove(+id);
  //   }
}
