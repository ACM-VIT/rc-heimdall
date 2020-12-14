import { Controller, Get, Post, Body, Put, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { Participant } from './participant.entity';
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { ApiTags } from '@nestjs/swagger';

/**
 * **Participants Controller**
 *
 * All routes related to participants are declared here, and the decorators represent the type of request
 * they respond to. Use ValidationPipe to validate client requests, and the rules for validation are
 * defined in [[CreateParticipantDto]].
 *
 * The controller calls [[ParticipantsService]] for all operations.
 *
 * @category Participants
 */
@ApiTags('Participants')
@Controller('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  /**
   * Responds to: _POST(`/`)_
   *
   * To create a new participant using [[CreateParticipantDto]]
   */
  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createParticipantDto: CreateParticipantDto): Promise<Participant> {
    return this.participantsService.create(createParticipantDto);
  }

  /**
   * Responds to: _GET(`/`)_
   *
   * To list all the participants
   */
  @Get()
  findAll() {
    return this.participantsService.findAll();
  }

  /**
   * Responds to: _GET(`/:id`)_
   *
   * To display all details of particular participant
   */
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.participantsService.findOne(+id);
  }

  /**
   * Responds to: _DELETE(`/:id`)_
   *
   * To delete a participant
   *
   */
  //   @Delete(':id')
  //   remove(@Param('id') id: number) {
  //     return this.participantsService.remove(+id);
  //   }
}
