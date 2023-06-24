import { EntityRepository, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestCase } from './testCase.entity';

/**
 * **Problems Repository**
 *
 * This is the data persistence layer and is responsible for database related operations.
 *
 * @category Problems
 */
@Injectable()
export class TestCaseRepository extends Repository<TestCase> {
  constructor(@InjectRepository(TestCase) repository: Repository<TestCase>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  async fetchDetailsByToken(token: string) {
    const query = await this.createQueryBuilder('testcase')
      .andWhere('testcase.token = :token', { token })
      .leftJoinAndSelect('testcase.submission', 'JudgeSubmissions')
      .getOne();
    return query;
  }
}
