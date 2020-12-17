import { BaseEntity, Column, Entity, IsNull, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Team } from '../teams/team.entity';

/**
 * Participant Entity represents data related to participants and its relationships
 * with other entities.
 *
 * Read-up about typeORM entities to get more insights about decorators used.
 *
 * @category Participants
 */
@Entity()
export class Participant extends BaseEntity {
  /** unique id of the participant, auto-generated */
  @PrimaryGeneratedColumn()
  id: number;

  /** googleID obtained after OAuth */
  @Column()
  googleID: string;

  /** name of the participant */
  @Column()
  name: string;

  /** email using which OAuth was performed */
  @Column({
    nullable: true,
  })
  email: string;

  /** college registration number */
  @Column({
    nullable: true,
  })
  registrationNumber: string;

  /** whether participant is admin of his/her team */
  @Column({
    default: false,
  })
  isAdmin: boolean;

  /** contact number of participant, optional */
  @Column({
    nullable: true,
  })
  phoneNumber: string;

  /** entity representing team which the participant is a member of */
  @ManyToOne(
    () => Team,
    (team) => team.participants,
  )
  team: Team;
}
