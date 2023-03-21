import { Controller,  UseGuards, Get, Redirect, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@UseGuards(GoogleAuthGuard)
@Controller('auth/google')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth() {}

  @Get('redirect')
  @Redirect()
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }
}
