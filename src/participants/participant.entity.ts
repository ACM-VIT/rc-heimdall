import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Team } from '../teams/team.entity';

/**
 * Object to represent Participant Entity
 * @typedef {Object} Participant
 * @property {number} id - id of the participant
 * @property {string} googleID - google OAuth id of user, based on email
 * @property {string} name - name of the participant
 * @property {string} email - email of the participant
 * @property {string} registrationNumber - university registration number of participant
 * @property {boolean} isAdmin - whether participant is admin of the team
 * @property {string} phoneNumber - contact number of participant
 * @property {Team} team - details about the team the participant is a member of.
 */
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
    (team) => team.participants,
  )
  team: Team;
}
