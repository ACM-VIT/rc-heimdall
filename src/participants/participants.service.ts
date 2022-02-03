import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from 'typedoc/dist/lib/utils';
import { MoreThanOrEqual } from 'typeorm';
import { TeamsService } from '../teams/teams.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/updateParticipantDto.dto';
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
    const participantTeam = await this.teamService.findOne(createParticipantDto.team_id);
    if (participantTeam === undefined) {
      const newTeam = await this.teamService.create({
        name: createParticipantDto.team.name,
        id: createParticipantDto.team_id,
      });
      return this.participantRepository.createParticipantAndJoinTeam(createParticipantDto, newTeam);
    }
    return this.participantRepository.createParticipantAndJoinTeam(createParticipantDto, participantTeam);
  }

  /**
   * Update  participant and adds him/her details in the existing details using [[UpdateParticipantDto]]
   * Updating the participant details using participant ID
   */
  async update(id, updateParticipantDto: UpdateParticipantDto) {
    console.log('id: ', id);
    try {
      const participant = await this.participantRepository.findOneByEmailAndGoogleID(id);
      console.log(participant);
      if (participant) {
        participant.phoneNumber = updateParticipantDto.phoneNumber;
        participant.registrationNumber = updateParticipantDto.registrationNumber;
        participant.college = updateParticipantDto.college;
        participant.fresher = updateParticipantDto.fresher;
        return await this.participantRepository.save(participant);
      }
      return participant;
    } catch (error) {
      throw new NotFoundException({
        error: 'ps-nf-001',
        message: 'Parctipant not found',
      });
    }
  }

  /**
   * To return list of all participants
   */
  findAll() {
    return this.participantRepository.find();
  }

  /**
   * To return details of particular participant by email
   */
  async findOneByEmailAndID(googleID: string) {
    return this.participantRepository.findOneByEmailAndGoogleID(googleID);
  }

  /**
   * To Delete a participant by ID
   */
  remove(id: number) {
    return this.participantRepository.delete({ id });
  }

  /**
   * clear the participant storages
   */
  clear() {
    return this.participantRepository.delete({ id: MoreThanOrEqual(0) });
  }
}
