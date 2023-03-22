import { EntityRepository, Repository } from 'typeorm';
import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './team.entity';
import { Cache } from 'cache-manager';

/**
 * **Teams Repository**
 *
 * This is the data persistence layer and is responsible for database related operations.
 *
 * @category Teams
 */
@Injectable()
export class TeamRepository extends Repository<Team> {
  constructor(
    @InjectRepository(Team) repository: Repository<Team>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
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
    if ((await this.cacheManager.get('round')) > 1) {
      const query = await this.createQueryBuilder('team')
        .orderBy('team.pointsR2', 'DESC')
        .addOrderBy('team.timestamp', 'ASC')
        .select('team.name')
        .addSelect('team.id')
        .addSelect('team.pointsR2')
        .addSelect('team.timestamp')
        .getMany();
      return query;
    }
    const query = await this.createQueryBuilder('team')
      .orderBy('team.points', 'DESC')
      .addOrderBy('team.timestamp', 'ASC')
      .select('team.name')
      .addSelect('team.id')
      .addSelect('team.points')
      .addSelect('team.timestamp')
      .getMany();
    return query;
  }

  // async getAssignedProblems(id: number) {
  //   const query = await this.createQueryBuilder('team')
  //     .leftJoin('team.problems', 'problem')
  //     .select('problem.id')
  //     .addSelect()
  //     .addSelect('problem.difficulty')
  //     .addSelect('')
  //     .getMany();
  //   return query;
  // }

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
