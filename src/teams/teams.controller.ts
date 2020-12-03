import { Controller, Get, Post, Body, Put, Param, Delete, ValidationPipe, UsePipes } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './team.entity';
import { ApiTags } from '@nestjs/swagger';

/**
 * Teams Controller
 */
@ApiTags('Teams')
@Controller('teams')
/**
 * @class
 */
export class TeamsController {
  /** initiate controller  */
  constructor(private readonly teamsService: TeamsService) {}

  /**
   * To Create a new team
   * @param {CreateTeamDto} createTeamDto - details of team
   * @returns {Team} team - created team details
   */
  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createTeamDto: CreateTeamDto): Promise<Team> {
    return this.teamsService.create(createTeamDto);
  }

  /**
   * Get list of all teams along-with their problem submissions.
   * @returns {Team[]} - Details of all the teams
   */
  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  /**
   * Get leaderBoard with team id, name and points.
   */
  @Get('/leader')
  leaderBoard() {
    return this.teamsService.getLeaderBoard();
  }

  /**
   * Get details of team by id
   * @param id TeamID to get details of individual team
   */
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.teamsService.findOneById(id);
  }

  /**
   * Delete a team by id
   * @param id TeamID to delete a team
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamsService.remove(+id);
  }
}
