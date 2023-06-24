import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Module } from '@nestjs/common';
import { ParticipantsModule } from '../participants/participants.module';
import { PassportModule } from '@nestjs/passport';
import { newJWTConstants } from './constants/auth.constants';
import { GoogleStrategy } from './strategies/google.strategy';

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
  providers: [AuthService, JwtStrategy, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
