import { EntityRepository, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './team.entity';

/**
 * **Teams Repository**
 *
 * This is the data persistence layer and is responsible for database related operations.
 *
 * @category Teams
 */
@Injectable()
export class TeamRepository extends Repository<Team> {
  constructor(@InjectRepository(Team) repository: Repository<Team>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

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
      .addOrderBy('team.timestamp', 'DESC')
      .select('team.name')
      .addSelect('team.id')
      .addSelect('team.points')
      .addSelect('team.timestamp')
      // .limit(600)
      .getMany();
    return query;
  }

  async getAssignedProblems(id: number) {
    const query = await this.createQueryBuilder('team')
      .leftJoinAndSelect('team.problems', 'problem')
      // .andWhere('team.id = :id', { id })
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
    const query = await this.createQueryBuilder('team').delete().execute();
    return query;
  }
}
