import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { ParticipantRepository } from './participants.repository';

@Injectable()
export class ParticipantsService {
  /** injecting repository for persistence */
  constructor(
    @InjectRepository(ParticipantRepository)
    private participantRepository: ParticipantRepository,
  ) {}

  create(createParticipantDto: CreateParticipantDto) {
    return this.participantRepository.createWithJoins(createParticipantDto);
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
