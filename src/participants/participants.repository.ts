import { EntityRepository, Repository } from 'typeorm';

import { CreateParticipantDto } from './dto/create-participant.dto';
import { Participant } from './participant.entity';
import { Team } from 'src/teams/team.entity';

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
    const { email, googleID, name, phoneNumber, registrationNumber, isAdmin } = createParticipantDto;
    const participant = this.create();
    participant.email = email;
    participant.googleID = googleID;
    participant.name = name;
    participant.phoneNumber = phoneNumber;
    participant.registrationNumber = registrationNumber;
    participant.isAdmin = isAdmin;
    participant.team = team;

    await participant.save();
    return participant;
  }
}
