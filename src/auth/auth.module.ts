import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.stratergy';
import { LocalStrategy } from './local.strategy';
import { Module } from '@nestjs/common';
import { ParticipantsModule } from '../participants/participants.module';
import { PassportModule } from '@nestjs/passport';
import { newJWTConstants } from './constants/auth.constants';

@Module({
  imports: [
    ParticipantsModule,
    PassportModule,
    JwtModule.register({
      secret: newJWTConstants.secret,
      signOptions: { expiresIn: newJWTConstants.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
