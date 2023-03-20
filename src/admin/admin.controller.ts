import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UpdateRoundDto } from './dto/updateRound.dto';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
  @Post('round')
  async updateRound(@Body() updateRoundDto: UpdateRoundDto) {
    try {
      return 1;
    } catch (error) {
      return error;
    }
  }
}
