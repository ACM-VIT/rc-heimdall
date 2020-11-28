import { EntityRepository, Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './team.entity';

@EntityRepository(Team)
export class TeamRepository extends Repository<Team> {
  async createWithJoins(createTeamDto: CreateTeamDto): Promise<Team> {
    const { name } = createTeamDto;
    const team = this.create();
    team.name = name;
    await team.save();
    return team;
  }
}
