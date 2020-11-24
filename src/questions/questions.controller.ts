import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get('/seed')
  @HttpCode(202)
  fetchQuestionsFromFirebase() {
    return this.questionsService.fetchQuestionsFromFirebase();
  }

  @Get(':id')
  checkIfQuestionExists(@Param('id') id: string) {
    return this.questionsService.checkIfQuestionExist({ id });
  }
}
