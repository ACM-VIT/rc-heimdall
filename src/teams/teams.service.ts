import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './team.entity';
import { TeamRepository } from './teams.repository';

/**
 * Teams Service
 */
@Injectable()
export class TeamsService {
  private readonly logger = new Logger('teams');

  /**
   * @constructs
   * @description Initialize teams repository
   * @param teamRepository TeamsRepository object to act as persistence layer
   */
  constructor(
    @InjectRepository(TeamRepository)
    private teamRepository: TeamRepository,
  ) {
    this.logger.verbose('service initialized');
  }

  /**
   * To Create a new team
   * @param {CreateTeamDto} createTeamDto - Team details required while creating a new team
   */
  create(createTeamDto: CreateTeamDto): Promise<Team> {
    return this.teamRepository.createWithJoins(createTeamDto);
  }

  /**
   *
   */
  findAll() {
    return this.teamRepository.find();
  }

  /**
   *
   * @param name
   */
  async findOne(name: string) {
    const response = await this.teamRepository.find({ name });
    if (response.length === 0) {
      return undefined;
    }
    return response[0];
  }

  /**
   *
   * @param id
   */
  async findOneById(id: number) {
    return this.teamRepository.findOne(id);
  }

  /**
   *
   * @param id
   */
  remove(id: number) {
    return this.teamRepository.delete({ id });
  }

  /**
   *
   */
  async getLeaderBoard() {
    return this.teamRepository.getLoaderBoard();
  }
}
