import { Controller, Get, Post, Body, Put, Param, Delete, UsePipes, ValidationPipe, Logger } from '@nestjs/common';
import { JudgeService } from './judge.service';
import { CreateJudgeDto } from './dto/create-judge.dto';
import { UpdateJudgeDto } from './dto/update-judge.dto';
import { CallbackJudgeDto } from './dto/callback-judge.dto';
import { ApiTags } from '@nestjs/swagger';
import { CODE_STATES, DILUTE } from './enum/codeStates.enum';

@ApiTags('Judge')
@Controller('judge')
export class JudgeController {
  private readonly logger = new Logger('judge controller');
  constructor(private readonly judgeService: JudgeService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createJudgeDto: CreateJudgeDto) {
    return this.judgeService.create(createJudgeDto);
  }

  @Get()
  findAll() {
    return this.judgeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.judgeService.findOne(+id);
  }

  @Put('callback')
  @UsePipes(ValidationPipe)
  callbackHandler(@Body() callbackJudgeDto: CallbackJudgeDto) {
    this.logger.verbose(`Received callback for ${callbackJudgeDto.token} :: ${DILUTE[callbackJudgeDto.status.id]}`);
    return this.judgeService.handleCallback(callbackJudgeDto);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  update(@Param('id') id: string, @Body() updateJudgeDto: UpdateJudgeDto) {
    return this.judgeService.update(+id, updateJudgeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.judgeService.remove(+id);
  }
}
