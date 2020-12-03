import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './team.entity';
import { TeamRepository } from './teams.repository';

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
  ) {
    this.logger.verbose('service initialized');
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
}
