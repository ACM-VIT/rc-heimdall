import { Controller, Get, Post, Body, UsePipes, ValidationPipe, UseGuards, Request } from '@nestjs/common';
import { Participant } from './participants.entity';
import { ParticipantsService } from './participants.service';
import { UpdateParticipantDto } from './dto/updateParticipant.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { User } from '../auth/auth.interface';

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
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@UsePipes(ValidationPipe)
@Controller('participant')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  /**
   * Responds to: _POST(`/`)_
   *
   * To update a the details of participant
   */
  @Post('update')
  async updateParticipant(@Request() req, @Body() updateParticipantDto: UpdateParticipantDto): Promise<Participant> {
    return await this.participantsService.update(req.user.id, updateParticipantDto);
  }

  /**
   * Responds to: _GET(`/`)_
   *
   * To display all details of particular participant
   */
  @Get()
  getParticipant(@Request() req) {
    return this.participantsService.getParticipant(req.user.id);
  }
}
