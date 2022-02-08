import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm';

import { JudgeSubmissions } from '../judge/judge.entity';
import { Participant } from '../participants/participant.entity';
import { Problems } from '../problems/problem.entity';

/**
 * **Team Entity**
 *
 * Team Entity represents data related to teams and its relationships
 * with other entities.
 *
 * Read-up about typeORM entities to get more insights about decorators used.
 *
 * @category Teams
 */

@Entity()
export class Team extends BaseEntity {
  /** primary key, auto-generated */
  @PrimaryColumn()
  id: number;

  /** each team should have a unique name */
  @Column({
    unique: true,
  })
  name: string;

  /** the points acquired by each time after solving questions */
  @Column({ type: 'int', default: 0 })
  points: number;

  /** the points acquired by each time after solving questions */
  @Column({ type: 'int', default: 0 })
  pointsR2: number;

  /** 1:N relation between [[Team]] and [[Participant]]. One team can include any number of participants */
  @ManyToMany(
    () => Participant,
    (participant) => participant.team,
  )
  participants: Participant[];

  /** 1:N relation between [[Team]] and [[JudgeSubmissions]] made.*/
  @OneToMany(
    () => JudgeSubmissions,
    (judgeSubmissions) => judgeSubmissions.team,
    // { eager: true },
  )
  judgeSubmissions: JudgeSubmissions[];

  /** store question details of problems assigned to participant */
  @Column({
    default: '',
    nullable: true,
  })
  problems: string;

  /** store timestamp for tie-braking  */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
