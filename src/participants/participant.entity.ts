import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Team } from '../teams/team.entity';

@Entity()
export class Participant extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  googleID: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  registrationNumber: string;

  @Column({
    default: false,
  })
  isAdmin: boolean;

  @Column()
  phoneNumber: string;

  @ManyToOne(
    () => Team,
    team => team.participants,
  )
  team: Team;
}
