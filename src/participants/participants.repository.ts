import { EntityRepository, Repository } from 'typeorm';

import { CreateParticipantDto } from './dto/create-participant.dto';
import { Participant } from './participant.entity';
import { Team } from '../teams/team.entity';

/**
 * **Participants Repository**
 *
 * This is the data persistence layer and is responsible for database related operations.
 *
 * @category Participants
 */
@EntityRepository(Participant)
export class ParticipantRepository extends Repository<Participant> {
  /**
   * Creates a new participant based on details provided by [[CreateParticipantDto]] and
   * adds the participant to the said [[Team]].
   *
   * This does not restrict the total number of participants, and can allow any number of
   * participants to join a particular team.
   */
  async createParticipantAndJoinTeam(createParticipantDto: CreateParticipantDto, team: Team): Promise<Participant> {
    const { email, googleID, name, isAdmin, team_id } = createParticipantDto;
    const participant = this.create();
    participant.email = email;
    participant.name = name;
    participant.teamLeader = isAdmin;
    participant.team = team;

    await participant.save();
    return participant;
  }

  async findOneByEmailAndGoogleID(googleID: string) {
    const query = await this.createQueryBuilder('participant')
      .andWhere('participant.googleID = :token', { token: googleID })
      // .leftJoinAndSelect('participant.team', 'problems')
      .getOne();

    return query;
  }
}
