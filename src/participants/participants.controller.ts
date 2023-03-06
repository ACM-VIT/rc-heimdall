import { Controller, Get, Post, Body, UsePipes, ValidationPipe, UseGuards, Request } from '@nestjs/common';
import { Participant } from './participant.entity';
import { ParticipantsService } from './participants.service';
import { UpdateParticipantDto } from './dto/updateParticipantDto.dto';
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
@Controller('participants')
@UseGuards(JwtAuthGuard)
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  /**
   * Responds to: _POST(`/`)_
   *
   * To update a the details of participant
   */
  @Post('update')
  @UsePipes(ValidationPipe)
  async updateParticipant(@Request() req, @Body() updateParticipantDto: UpdateParticipantDto): Promise<Participant> {
    const user: User = req.user;
    return await this.participantsService.update(user.id, updateParticipantDto);
  }

  /**
   * Responds to: _GET(`/`)_
   *
   * To list all the participants
   */
  // @UseGuards(JwtAuthGuard)
  // @Get()
  // findAll() {
  //   return this.participantsService.findAll();
  //   return [];
  // }

  /**
   * Responds to: _GET(`/`)_
   *
   * To display all details of particular participant
   */
  @Get()
  @UsePipes(ValidationPipe)
  getParticipant(@Request() req) {
    const user: User = req.user;
    return this.participantsService.getParticipant(user.id);
  }

  /**
   * Responds to: _DELETE(`/`)_
   *
   * To delete all participants
   *
   */
  // @UseGuards(JwtAuthGuard)
  // @Delete()
  // deleteAll() {
  //   return this.participantsService.clear();
  // }
}
