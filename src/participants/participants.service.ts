import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamsService } from '../teams/teams.service';
import { UpdateParticipantDto } from './dto/updateParticipant.dto';
import { Participant } from './participants.entity';
import { JudgeService } from '../judge/judge.service';
import { symbolName } from 'typescript';

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
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,

    /** injecting [[TeamsService]] to handle team creation and team joining operations */
    @Inject(TeamsService)
    private readonly teamService: TeamsService,
    /** inject [[JudgeService]] to handle submission querying operations */
    @Inject(JudgeService)
    private readonly judgeService: JudgeService,
  ) {}

  /**
   * Update  participant and adds him/her details in the existing details using [[UpdateParticipantDto]]
   * Updating the participant details using participant ID
   */
  async update(id, updateParticipantDto: UpdateParticipantDto) {
    try {
      const participant = await this.participantRepository.findOne({ where: { id } });
      if (participant) {
        participant.phone = updateParticipantDto.phone;
        participant.regNum = updateParticipantDto.regNum;
        participant.uniName = updateParticipantDto.uniName;
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

  async getParticipant(id: number) {
    const user = await this.participantRepository.findOne({ where: { id }, relations: { team: true } });
    const team = await this.teamService.findOneByIdWithSubmissions(user.team.id);
    const submissions = await this.judgeService.findWithTeamID(team.id);
    const participants = team.participants.map((participant) => {
      return participant.name;
    });
    const data = {
      name: user.name,
      team: team.name,
      participants: participants,
      score: team.pointsR2,
      submissions: submissions,
    };
    return data;
  }

  /**
   * To return details of particular participant by email
   */
  async findOneByEmail(email: string) {
    return await this.participantRepository.findOne({ where: { email }, relations: { team: true } });
  }
}
