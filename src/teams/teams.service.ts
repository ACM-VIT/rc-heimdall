import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './team.entity';
import { TeamRepository } from './teams.repository';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(TeamRepository)
    private teamRepository: TeamRepository,
  ) {}

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
}
