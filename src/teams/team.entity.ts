import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { JudgeSubmissions } from 'src/judge/judge.entity';
import { Participant } from '../participants/participant.entity';

@Entity()
export class Team extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @Column({ type: 'int', default: 0 })
  points: number;

  @OneToMany(
    () => Participant,
    (participant) => participant.team,
    {
      eager: true,
    },
  )
  participants: Participant[];

  @OneToMany(
    () => JudgeSubmissions,
    (judgeSubmissions) => judgeSubmissions.team,
    { eager: true },
  )
  judgeSubmissions: JudgeSubmissions[];
}
