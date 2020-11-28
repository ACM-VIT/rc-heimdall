import { Team } from 'src/teams/team.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { Participant } from './participant.entity';

@EntityRepository(Participant)
export class ParticipantRepository extends Repository<Participant> {
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
