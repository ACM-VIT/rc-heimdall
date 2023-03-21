import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UpdateRoundDto } from './dto/updateRound.dto';
import { AdminService } from './admin.service';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('round')
  async updateRound(@Body() updateRoundDto: UpdateRoundDto) {
    return await this.adminService.updateRound(updateRoundDto.round);
  }
}
