import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CodeStates } from './enum/codeStates.enum';
import { Problems } from '../problems/problem.entity';
import { Team } from '../teams/team.entity';
import { TestCase } from 'src/testCase/testCase.entity';

/**
 * **Judge Entity**
 *
 * Judge Entity represents data related to judge submissions and its relationships
 * with other entities.
 *
 * Read-up about typeORM entities to get more insights about decorators used.
 *
 * @category Judge
 */
@Entity()
export class JudgeSubmissions extends BaseEntity {
  /** numeric, auto-increment id of submission */
  @PrimaryGeneratedColumn()
  id: number;

  /** details of [[Problems]] for which the submission is made */
  @ManyToOne(
    () => Problems,
    (problem) => problem.submissions,
    { eager: true },
  )
  problem: Problems;

  /** details of [[Team]] who made the submission */
  @ManyToOne(
    () => Team,
    (team) => team.judgeSubmissions,
  )
  team: Team;

  /** numeric ID of the language in which the submission was made */
  @Column({
    type: 'int',
  })
  language: number;

  /** points assigned to the submission */
  @Column({
    type: 'int',
    default: 0,
  })
  points: number;

  @OneToMany(
    () => TestCase,
    (testCase) => testCase.submission,
  )
  testCase: TestCase[];

  @Column({
    type: 'int',
    default: 0,
  })
  returned_testcases: number;

  /**
   * base64 representation of code submitted by participant. Kept in base64 to accommodate
   * non-printable symbols and easy data transfer
   */
  @Column()
  code: string;
}
