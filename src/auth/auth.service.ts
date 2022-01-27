import { JwtService } from '@nestjs/jwt';
import { Participant } from 'src/participants/participant.entity';
import { ParticipantsService } from 'src/participants/participants.service';
import { Inject, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TokenExchangeDTO } from './dto/token-exchange.dto';
import { newJWTConstants, oldJWTConstants } from './constants/auth.constants';
import { AuthToken } from './interface/auth.token.interface';
import { networkInterfaces } from 'os';

@Injectable()
export class AuthService {
  /** initialize a logger with auth context */
  private readonly logger = new Logger('auth');

  constructor(
    /** Inject [[ParticipantService]] as a dependency */
    private jwtService: JwtService,

    @Inject(ParticipantsService)
    private readonly participantService: ParticipantsService,
  ) {}

  /** check if given user is registered into database */
  async validateUser(token: string): Promise<any> {
    try {
      const isValidToken = await this.jwtService.verifyAsync(token, newJWTConstants);
      return isValidToken;
    } catch (e) {
      throw new UnauthorizedException(`Un-authorized access`);
    }
  }

  async tokenExchanger(tokenExchangeDTO: TokenExchangeDTO): Promise<string> {
    try {
      const { token } = tokenExchangeDTO;
      console.log('tokenExchanger', token);
      const isValidToken: AuthToken = await this.jwtService.verifyAsync(token, oldJWTConstants);
      console.log('isValidToken', isValidToken);
      const { googleID } = isValidToken;
      const userDetails = await this.participantService.findOneByEmailAndID(googleID);
      if (userDetails === undefined) {
        throw new NotFoundException();
      }

      console.log(userDetails);

      const payload = {
        // team: {
        //   id: userDetails.team.id,
        //   name: userDetails.team.name,
        // },
        participant: {
          googleID: userDetails.googleID,
          name: userDetails.name,
          isAdmin: userDetails.isAdmin,
        },
      };

      console.log("first payload", payload);

      const newToken = await this.jwtService.signAsync(payload, newJWTConstants);
      return newToken;
      return;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException(`Invalid token`);
    }
  }
}
