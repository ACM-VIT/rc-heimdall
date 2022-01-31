import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn, } from 'typeorm';

import { CodeStates } from './enum/codeStates.enum';
import { JudgeSubmissions } from '../judge/judge.entity';
// testcase.entity
// Token (one) (to be indexed) PK
// submission id FK
// Date created
// Date updated
// status

@Entity()
export class TestCase extends BaseEntity {
  /** token from judge0 to be indexed */
  @PrimaryColumn()
  token: string;

  @ManyToOne(
    () => JudgeSubmissions,
    (submission) => submission.testCase,
  )
  submission: JudgeSubmissions;

  /** testcase number can be from 1 to 5 */
  @Column({
    type: 'int',
  })
  testCaseNumber: number;

  @Column()
  dateCreated: Date;

  @Column()
  dateUpdated: Date;

  @Column({
    type: 'enum',
    enum: CodeStates,
    default: CodeStates.IN_QUEUE,
  })
  state: CodeStates;
}
