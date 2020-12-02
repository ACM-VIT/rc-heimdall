import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './team.entity';
import { TeamRepository } from './teams.repository';

@Injectable()
export class TeamsService {
  private readonly logger = new Logger('teams');

  constructor(
    @InjectRepository(TeamRepository)
    private teamRepository: TeamRepository,
  ) {
    this.logger.verbose('service initialized');
  }

  create(createTeamDto: CreateTeamDto): Promise<Team> {
    return this.teamRepository.createWithJoins(createTeamDto);
  }

  findAll() {
    return this.teamRepository.find();
  }

  async findOne(name: string) {
    const response = await this.teamRepository.find({ name });
    if (response.length === 0) {
      return undefined;
    }
    return response[0];
  }

  async findOneById(id: number) {
    return this.teamRepository.findOne(id);
  }

  remove(id: number) {
    return this.teamRepository.delete({ id });
  }

  /** serivce to generate and return leaderboard */
  async getLeaderBoard() {
    return this.teamRepository.getLoaderBoard();
  }
}
