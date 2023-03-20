import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Request,
  UsePipes,
  ValidationPipe,
  Logger,
  UseGuards,
  UnauthorizedException,
  Delete,
} from '@nestjs/common';
import { JudgeService } from './judge.service';
import { CreateJudgeDto } from './dto/create-judge.dto';
import { UpdateJudgeDto } from './dto/update-judge.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { User } from '../auth/auth.interface';
import * as config from 'config';

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
  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async create(@Request() req, @Body() createJudgeDto: CreateJudgeDto) {
    try {
      const teamId: number = req.user.teamId;
      this.logger.verbose(`New submission from ${teamId}`);
      return await this.judgeService.create(teamId, createJudgeDto);
    } catch (err) {
      return err;
    }
  }

  /**
   * Responds to: _GET(`/`)_
   *
   * Returns list of all submissions
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req) {
    const user: User = req.user;
    if (config.get('application.assignProblemToTeams')) {
      return this.judgeService.findAssignedSubmissions(user.teamId);
    }
    return this.judgeService.findWithTeamID(user.teamId);
  }

  /**
   * Responds to: _GET(`/:id`)_
   *
   * returns details of particular submission
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Request() req, @Param('id') id: string) {
    const user: User = req.user;
    return this.judgeService.findOneByTeamAndID(id, user.teamId);
  }

  /**
   * Responds to: _PUT(`/:id`)_
   *
   * To update individual submission particulars
   */
  @Put(':id')
  @UsePipes(ValidationPipe)
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
