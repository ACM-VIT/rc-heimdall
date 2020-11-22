import { Controller, Get, Param } from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get('/seed')
  fetchQuestionsFromFirebase() {
    return this.questionsService.fetchQuestionsFromFirebase();
  }

  @Get(':id')
  checkIfQuestionExists(@Param('id') id: string): Promise<boolean> {
    return this.questionsService.checkIfQuestionExist({ id });
  }
}
