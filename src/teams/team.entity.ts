import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
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
    participant => participant.team,
    {
      eager: true,
    },
  )
  participants: Participant[];
}
