import { Controller, Get, Post, Body, Put, Param, Delete, UsePipes, ValidationPipe, Logger } from '@nestjs/common';
import { JudgeService } from './judge.service';
import { CreateJudgeDto } from './dto/create-judge.dto';
import { UpdateJudgeDto } from './dto/update-judge.dto';
import { CallbackJudgeDto } from './dto/callback-judge.dto';
import { ApiTags } from '@nestjs/swagger';
import { DILUTE } from './enum/codeStates.enum';

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
  @UsePipes(ValidationPipe)
  create(@Body() createJudgeDto: CreateJudgeDto) {
    return this.judgeService.create(createJudgeDto);
  }

  /**
   * Responds to: _GET(`/`)_
   *
   * Returns list of all submissions
   */
  @Get()
  findAll() {
    return this.judgeService.findAll();
  }

  /**
   * Responds to: _GET(`/:id`)_
   *
   * returns details of particular submission
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.judgeService.findOne(id);
  }

  /**
   * Responds to: _PUT(`/callback`)_
   *
   * To receive callback from judge0 and initiate points tally
   */
  @Put('callback')
  @UsePipes(ValidationPipe)
  callbackHandler(@Body() callbackJudgeDto: CallbackJudgeDto) {
    this.logger.verbose(`> ${callbackJudgeDto.token} :: ${DILUTE[callbackJudgeDto.status.id]}`);
    return this.judgeService.handleCallback(callbackJudgeDto);
  }

  /**
   * Responds to: _PUT(`/:id`)_
   *
   * To update individual submission particulars
   */
  @Put(':id')
  @UsePipes(ValidationPipe)
  update(@Param('id') id: string, @Body() updateJudgeDto: UpdateJudgeDto) {
    return this.judgeService.update(+id, updateJudgeDto);
  }

  /**
   * Responds to: _DELETE(`/:id`)_
   *
   * To delete a submission by id
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.judgeService.remove(+id);
  }
}
