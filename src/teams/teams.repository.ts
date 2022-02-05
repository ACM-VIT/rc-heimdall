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
    const { name, id } = createTeamDto;
    const team = this.create();
    team.name = name;
    team.id = id;
    await team.save();
    return team;
  }

  /** to generate the [[Team]] leaderBoard based on [[Team.points]] */
  async getLeaderBoard() {
    // show top 10 teams based on points and timestamp
    const query = await this.createQueryBuilder('team')
      .orderBy('team.points', 'DESC')
      // ascending order
      .addOrderBy('team.timestamp', 'ASC')
      .select('team.name')
      .addSelect('team.id')
      .addSelect('team.points')
      .limit(600)
      .getMany();

    return query;
  }

  async getAssignedProblems(id: number) {
    const query = await this.createQueryBuilder('team')
      .andWhere('team.id = :id', { id })
      .leftJoinAndSelect('team.problems', 'problem')
      .getMany();

    return query;
  }

  /** to get team details with participants */
  async findWithParticipants(id: number): Promise<Team> {
    const query = await this.createQueryBuilder('team')
      .andWhere('team.id = :id', { id })
      .leftJoinAndSelect('team.participants', 'participant')
      .getOne();
    return query;
  }

  /** to remove all teams */
  async removeAll() {
    const query = await this.createQueryBuilder('team')
      .delete()
      .execute();
    return query;
  }
}
