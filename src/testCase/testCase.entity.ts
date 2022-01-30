import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { CodeStates } from './enum/codeStates.enum';
import { Problems } from '../problems/problem.entity';
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
