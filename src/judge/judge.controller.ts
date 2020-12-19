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
} from '@nestjs/common';
import { JudgeService } from './judge.service';
import { CreateJudgeDto } from './dto/create-judge.dto';
import { UpdateJudgeDto } from './dto/update-judge.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DILUTE } from './enum/codeStates.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { JwtToken } from '../auth/interface/auth.token.interface';
import { Judge0Callback } from './interface/judge0.interfaces';

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
  create(@Request() req, @Body() createJudgeDto: CreateJudgeDto) {
    const user: JwtToken = req.user;
    if (user.team.id != createJudgeDto.teamID) {
      return new UnauthorizedException('who art thou');
    }

    this.logger.verbose(`New submission from ${createJudgeDto.teamID}`);
    return this.judgeService.create(createJudgeDto);
  }

  /**
   * Responds to: _GET(`/`)_
   *
   * Returns list of all submissions
   */
  //   @Get()
  //   @UseGuards(JwtAuthGuard)
  //   findAll() {
  //     return this.judgeService.findAll();
  //   }

  /**
   * Responds to: _GET(`/:id`)_
   *
   * returns details of particular submission
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Request() req, @Param('id') id: string) {
    const user: JwtToken = req.user;
    return this.judgeService.findOne(id);
  }

  /**
   * Responds to: _PUT(`/callback`)_
   *
   * To receive callback from judge0 and initiate points tally
   */
  @Put('QAEJCC9JjMfdAQZ4dTTNfVNF9jUHA3UW')
  callbackHandler(@Body() judge0Callback: Judge0Callback) {
    this.logger.verbose(`> ${judge0Callback.token} :: ${DILUTE[judge0Callback.status.id]}`);
    return this.judgeService.handleCallback(judge0Callback);
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
   *
   * To delete a submission by id
   */
  //   @Delete(':id')
  //   @UseGuards(JwtAuthGuard)
  //   remove(@Request() req, @Param('id') id: string) {
  //     return this.judgeService.remove(+id);
  //   }
}
