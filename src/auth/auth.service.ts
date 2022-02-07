import { JwtService } from '@nestjs/jwt';
import { ParticipantsService } from 'src/participants/participants.service';
import { Inject, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TokenExchangeDTO } from './dto/token-exchange.dto';
import { newJWTConstants, oldJWTConstants } from './constants/auth.constants';
import { AuthToken } from './interface/auth.token.interface';

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
      throw new UnauthorizedException({
        error: 'as-ua-001',
        message: 'Not authorized, invalid token',
      });
    }
  }

  async tokenExchanger(tokenExchangeDTO: TokenExchangeDTO): Promise<string> {
    try {
      const { token } = tokenExchangeDTO;
      const isValidToken: AuthToken = await this.jwtService.verifyAsync(token, oldJWTConstants);
      const { googleID } = isValidToken;
      const userDetails = await this.participantService.findOneByEmailAndID(googleID);
      if (userDetails === undefined) {
        throw new NotFoundException({
          error: 'as-nf-002',
          message: 'User not found in the database',
        });
      }

      const payload = {
        participant: {
          id: userDetails.id,
          googleID: userDetails.googleID,
          name: userDetails.name,
          isAdmin: userDetails.isAdmin,
          email: userDetails.email,
          team_id: userDetails.team_id,
        },
      };
      const newToken = await this.jwtService.signAsync(payload, newJWTConstants);
      return newToken;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException({
        error: 'as-ua-003',
        message: 'Not authorized, invalid token',
      });
    }
  }
}
