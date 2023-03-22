import { JwtService } from '@nestjs/jwt';
import { ParticipantsService } from 'src/participants/participants.service';
import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import * as config from 'config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,

    @Inject(ParticipantsService)
    private readonly participantService: ParticipantsService,
  ) {}

  async googleLogin(req) {
    try {
      if (!req.user) {
        throw new BadRequestException('no_user_from_google');
      }

      const participant = await this.participantService.findOneByEmail(req.user.email);
      //console.log(participant);
      if (!participant) {
        throw new BadRequestException("user_doesn't_exist");
      }

      const token = this.jwtService.sign({
        id: participant.id,
        teamId: participant.team.id,
      });

      const url = config.get<string>('redirectUrl') + '?token=' + token;
      return { url };
    } catch (error) {
      //console.log(error);
      const url = config.get<string>('redirectUrl') + '?error=' + error.message;
      return { url };
    }
  }
}
