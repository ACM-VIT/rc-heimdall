import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { JudgeSubmissions } from 'src/judge/judge.entity';
import { Participant } from '../participants/participant.entity';

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
  @PrimaryGeneratedColumn()
  id: number;

  /** each team should have a unique name */
  @Column({
    unique: true,
  })
  name: string;

  /** the points acquired by each time after solving questions */
  @Column({ type: 'int', default: 0 })
  points: number;

  /** 1:N relation between [[Team]] and [[Participant]]. One team can include any number of participants */
  @OneToMany(
    () => Participant,
    (participant) => participant.team,
    {
      eager: true,
    },
  )
  participants: Participant[];

  /** 1:N relation between [[Team]] and [[JudgeSubmissions]] made.*/
  @OneToMany(
    () => JudgeSubmissions,
    (judgeSubmissions) => judgeSubmissions.team,
    { eager: true },
  )
  judgeSubmissions: JudgeSubmissions[];
}
