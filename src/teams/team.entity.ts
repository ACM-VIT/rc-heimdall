import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { JudgeSubmissions } from 'src/judge/judge.entity';
import { Participant } from '../participants/participant.entity';

/**
 * Entity to store and represent team in databases
 * @typedef {Object} Team - Object to represent a teams entity
 * @property {number} id - ID of team
 * @property {string} name - name of the team
 * @property {number} points - points scored by the team
 * @property {Participant[]} participants - the members of the team
 * @property {JudgeSubmission[]} - submissions made by the team
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

  /** 1:N relation between team and participants. One team can include any number of participants */
  @OneToMany(
    () => Participant,
    (participant) => participant.team,
    {
      eager: true,
    },
  )
  participants: Participant[];

  /** 1:N relation between team and submissions made.*/
  @OneToMany(
    () => JudgeSubmissions,
    (judgeSubmissions) => judgeSubmissions.team,
    { eager: true },
  )
  judgeSubmissions: JudgeSubmissions[];
}
