import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  /** whether participant is admin of his/her team */
  @Column({
    default: false,
  })
  isAdmin: boolean;

  /** college of the participant */
  @Column({
    default: 'VIT',
  })
  college: string;

  /** registration number of the participant */
  @Column({
    default: '20VIT9999',
  })
  registrationNumber: string;

  /** phone number of the participant */
  @Column({
    default: '9000000000',
  })
  phoneNumber: string;

  /** To check if participant is a fresher from VIT */
  @Column({
    default: false,
  })
  fresher: boolean;

  /** entity representing team which the participant is a member of */
  @ManyToOne(
    () => Team,
    (team) => team.participants,
  )
  team: Team;

  /** team_id of the participant, references [[Team]] by [[Team.id]] */
  @Column({
    default: null,
  })
  team_id: number;
}
