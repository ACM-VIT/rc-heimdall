import { EntityRepository, Repository } from 'typeorm';

import { TestCase } from './testCase.entity';

/**
 * **Problems Repository**
 *
 * This is the data persistence layer and is responsible for database related operations.
 *
 * @category Problems
 */
@EntityRepository(TestCase)
export class TestCaseRepository extends Repository<TestCase> {}
