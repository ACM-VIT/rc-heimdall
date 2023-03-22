import { Controller, Get, Post, Body, Put, Param, Request, Logger, UseGuards, Req } from '@nestjs/common';
import { JudgeService } from './judge.service';
import { CreateJudgeDto } from './dto/create-judge.dto';
import { UpdateJudgeDto } from './dto/update-judge.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Throttle } from '@nestjs/throttler';
import { DisableAfterRound1Guard } from 'src/auth/guards/disable.guard';
import { Round2Guard } from 'src/auth/guards/round2.guard';

/**
 * **Judge Controller**
 *
 * All routes related to judge are declared here, and the decorators represent the type of request
 * they respond to. Use ValidationPipe to validate client requests, and the rules for validation are
 * defined in [[CreateJudgeDto]].
 *
 * The controller calls [[JudgeService]] for all operations.
 *
 * @category Judge
 */
@ApiTags('Judge')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('judge')
export class JudgeController {
  /** initialize the logger with judge context */
  private readonly logger = new Logger('judge');
  constructor(private readonly judgeService: JudgeService) {}

  /**
   * Responds to: _POST(`/`)_
   *
   * Creates a new submission based on data from [[CreateJudgeDto]].
   */
  @UseGuards(Round2Guard)
  @Throttle(3, 60)
  @Post()
  async create(@Req() req, @Body() createJudgeDto: CreateJudgeDto) {
    const teamId: number = req.user.teamId;
    this.logger.verbose(`New submission from ${teamId}`);
    return await this.judgeService.create(teamId, createJudgeDto);
  }

  /**
   * Responds to: _GET(`/`)_
   *
   * Returns list of all submissions
   */
  // @Get()
  // @UseGuards(JwtAuthGuard)
  // findAll(@Request() req) {
  //   const user: User = req.user;
  //   if (config.get('application.assignProblemToTeams')) {
  //     return this.judgeService.findAssignedSubmissions(user.teamId);
  //   }
  //   return this.judgeService.findWithTeamID(user.teamId);
  // }

  /**
   * Responds to: _GET(`/:id`)_
   *
   * returns details of particular submission
   */
  @Throttle(30, 15)
  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.judgeService.findOneByTeamAndID(id, req.user.teamId);
  }

  /**
   * Responds to: _PUT(`/:id`)_
   *
   * To update individual submission particulars
   */
  @Put(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateJudgeDto: UpdateJudgeDto) {
    return this.judgeService.update(+id, updateJudgeDto);
  }

  /**
   * Responds to: _DELETE(`/:id`)_
   * To delete a submission by id
   */
  // @Delete()
  // @UseGuards(JwtAuthGuard)
  // remove() {
  //   return this.judgeService.clear();
  // }
}
