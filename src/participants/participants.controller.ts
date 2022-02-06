import { Controller, Get, Post, Body, UsePipes, ValidationPipe, Delete, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { Participant } from './participant.entity';
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/updateParticipantDto.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { JwtToken } from 'src/auth/interface/auth.token.interface';
import * as Teams from '../../config/qualifiedteams.json';

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
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  /**
   * Responds to: _POST(`/`)_
   *
   * To create a new participant using [[CreateParticipantDto]]
   */
  // @UseGuards(JwtAuthGuard)
  // @Post()
  // @UsePipes(ValidationPipe)
  // create(@Body() createParticipantDto: CreateParticipantDto): Promise<Participant> {
  //   return this.participantsService.create(createParticipantDto);
  // }

  /**
   * Responds to: _POST(`/`)_
   *
   * To update a the details of participant
   */
  @UseGuards(JwtAuthGuard)
  @Post('update')
  @UsePipes(ValidationPipe)
  updateParticipant(@Request() req, @Body() updateParticipantDto: UpdateParticipantDto): Promise<Participant> {
    const user: JwtToken = req.user;
    console.log(user.participant.id);
    return this.participantsService.update(user.participant.googleID, updateParticipantDto);
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
   * Responds to: _GET(`/:id`)_
   *
   * To display all details of particular participant
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  findOne(@Request() req) {
    const googleID: JwtToken = req.user.participant.googleID;
    const user: JwtToken = req.user;
    if (!Teams.teamIds.includes(user.participant.team_id.toString())) {
      throw new UnauthorizedException(`Team not qualified!`);
    }
    return this.participantsService.findOneByEmailAndID(googleID.toString());
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
