import { Controller, Get, Post, Body, Put, Param, Delete, ValidationPipe, UsePipes } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './team.entity';
import { ApiTags } from '@nestjs/swagger';

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
   * Responds to: _GET(`/:id`)_
   *
   * Get details of [[Team]] by ID
   */
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.teamsService.findOneById(id);
  }

  /**
   * Responds to: _DELETE(`/:id`)_
   *
   * Delete a team by id
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamsService.remove(+id);
  }
}
