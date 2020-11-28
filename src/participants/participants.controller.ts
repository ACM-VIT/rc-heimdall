import { Controller, Get, Post, Body, Put, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { Participant } from './participant.entity';
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';

@Controller('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createParticipantDto: CreateParticipantDto): Promise<Participant> {
    return this.participantsService.create(createParticipantDto);
  }

  @Get()
  findAll() {
    return this.participantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.participantsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.participantsService.remove(+id);
  }
}
