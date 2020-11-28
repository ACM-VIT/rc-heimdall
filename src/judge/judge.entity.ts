import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Team } from '../teams/team.entity';
import { CodeStates } from './enum/codeStates.enum';

@Entity()
export class Participant extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /** attach team to each submission for reference */
  @ManyToOne(
    () => Team,
    team => team.participants,
  )
  team: Team;

  @Column()
  problemID: number;

  @Column({
    type: 'int',
  })
  language: number;

  @Column({
    type: 'enum',
    enum: CodeStates,
    default: CodeStates.IN_QUEUE,
  })
  state: CodeStates;

  @Column({
    type: 'int',
    default: 0,
  })
  points: number;

  @Column()
  submissionId: string;
}
