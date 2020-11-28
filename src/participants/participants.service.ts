import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamsService } from 'src/teams/teams.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { ParticipantRepository } from './participants.repository';

@Injectable()
export class ParticipantsService {
  /** injecting repository for persistence */
  constructor(
    @InjectRepository(ParticipantRepository)
    private readonly participantRepository: ParticipantRepository,

    @Inject(TeamsService)
    private readonly teamService: TeamsService,
  ) {}

  async create(createParticipantDto: CreateParticipantDto) {
    const participantTeam = await this.teamService.findOne(createParticipantDto.teamID);
    /** create team before creating participant */
    if (participantTeam === undefined) {
      const newTeam = await this.teamService.create({
        name: createParticipantDto.teamName,
      });
      return this.participantRepository.createParticipantAndJoinTeam(createParticipantDto, newTeam);
    }
    return this.participantRepository.createParticipantAndJoinTeam(createParticipantDto, participantTeam);
  }

  findAll() {
    return this.participantRepository.find();
  }

  findOne(id: number) {
    return this.participantRepository.find({ id });
  }

  remove(id: number) {
    return this.participantRepository.delete({ id });
  }
}
