import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { Injectable } from '@nestjs/common';
import * as config from "config"

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: config.get<string>('googleOauth.clientId'),
      clientSecret: config.get<string>('googleOauth.clientSecret'),
      callbackURL: config.get<string>('googleOauth.callbackUrl'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const user = {
      email: profile.emails[0].value,
      name: profile.displayName,
    };
    done(null, user);
  }
}
