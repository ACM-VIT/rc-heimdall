import { Controller, Get, Post, Body, Put, Param, Delete, ValidationPipe, UsePipes } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './team.entity';
import { ApiTags } from '@nestjs/swagger';
import { AssignProblemDTO } from './dto/assign-problem.dto';
import { Problems } from '../problems/problem.entity';

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
    return this.teamsService.findAll();
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
  getProblems(@Param('id') id: number) {
    return this.teamsService.getAssignedProblems(id);
  }

  /**
   * Responds to: _POST(`/problems`)_
   *
   * Assign a problem to team
   */
  @Post('/problems')
  @UsePipes(ValidationPipe)
  assignProblem(@Body() assignProblemDTO: AssignProblemDTO): Promise<Problems[]> {
    return this.teamsService.assignProblem(assignProblemDTO);
  }

  /**
   * Responds to: _GET(`/:id`)_
   *
   * Get details of [[Team]] by ID
   */
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const teamDetails = await this.teamsService.findOneByIdWithRank(id);
    const problems = teamDetails.problems.map((problem) => {
      return {
        id: problem.id,
        name: problem.name,
        maxPoints: problem.maxPoints,
        windowsFileURL: problem.windowsFileURL,
        objectFileURL: problem.objectFileURL,
        instructionsText: problem.instructionsText,
      };
    });

    return { ...teamDetails, problems };
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
