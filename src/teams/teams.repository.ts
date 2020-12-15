import { EntityRepository, Repository } from 'typeorm';

import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './team.entity';

/**
 * **Teams Repository**
 *
 * This is the data persistence layer and is responsible for database related operations.
 *
 * @category Teams
 */
@EntityRepository(Team)
export class TeamRepository extends Repository<Team> {
  /** to create a team  */
  async createWithJoins(createTeamDto: CreateTeamDto): Promise<Team> {
    const { name } = createTeamDto;
    const team = this.create();
    team.name = name;
    await team.save();
    return team;
  }

  /** to generate the [[Team]] leaderBoard based on [[Team.points]] */
  async getLeaderBoard() {
    const query = await this.createQueryBuilder('team')
      .select('team.name')
      .addSelect('team.id')
      .addSelect('team.points')
      .orderBy('team.points', 'DESC')
      .getMany();
    return query;
  }

  async getAssignedProblems(id: number): Promise<Team> {
    const query = await this.createQueryBuilder('team')
      .andWhere('team.ID = :id', { id })
      .leftJoinAndSelect('team.problems', 'problem')
      .getOne();

    return query;
  }
}
