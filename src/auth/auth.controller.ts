import { Controller, Post, UsePipes, ValidationPipe, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenExchangeDTO } from './dto/token-exchange.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //   @UseGuards(LocalAuthGuard)
  @Post('token/exchange')
  @UsePipes(ValidationPipe)
  async login(@Body() tokenExchangeDTO: TokenExchangeDTO): Promise<any> {
    return this.authService.tokenExchanger(tokenExchangeDTO);
  }
}
