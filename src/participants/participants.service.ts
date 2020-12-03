import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamsService } from 'src/teams/teams.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { ParticipantRepository } from './participants.repository';

/**
 * **Participants Service**
 *
 * Participants Service contains all business logic related to participants, and is designed to be
 * imported and re-used in other modules. Therefore it is to ensure that all methods of the service
 * are self-contained and fit to be used directly as per use-case.
 *
 * @category Participants
 */
@Injectable()
export class ParticipantsService {
  constructor(
    /** injecting [[ParticipantRepository]] as persistence layer */
    @InjectRepository(ParticipantRepository)
    private readonly participantRepository: ParticipantRepository,

    /** injecting [[TeamsService]] to handle team creation and team joining operations */
    @Inject(TeamsService)
    private readonly teamService: TeamsService,
  ) {}

  /**
   * Creates a new participant and adds him/her to the team mentioned in [[CreateParticipantDto]].
   * If the team does not exist, then it is created.
   */
  async create(createParticipantDto: CreateParticipantDto) {
    const participantTeam = await this.teamService.findOne(createParticipantDto.teamName);

    if (participantTeam === undefined) {
      const newTeam = await this.teamService.create({
        name: createParticipantDto.teamName,
      });
      return this.participantRepository.createParticipantAndJoinTeam(createParticipantDto, newTeam);
    }

    return this.participantRepository.createParticipantAndJoinTeam(createParticipantDto, participantTeam);
  }

  /**
   * To return list of all participants
   */
  findAll() {
    return this.participantRepository.find();
  }

  /**
   * To return details of particular participant by ID
   */
  findOne(id: number) {
    return this.participantRepository.find({ id });
  }

  /**
   * To Delete a participant by ID
   */
  remove(id: number) {
    return this.participantRepository.delete({ id });
  }
}
