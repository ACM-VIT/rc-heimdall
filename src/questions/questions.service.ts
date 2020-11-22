import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetQuestionDto } from './dto/filter-question.dto';
import { QuestionRepository } from './questions.repository';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(QuestionRepository)
    private questionRepository: QuestionRepository,
  ) {}

  /**
   * Method to seed data from firebase cloud bucket
   * @async
   * @param Null
   * @returns Null
   */
  async fetchQuestionsFromFirebase() {
    return 'This action adds a new question';
  }

  /**
   * Method to check if given question exists or not
   * @async
   * @param filterDto object containing ID of question to check if it exists
   * @returns boolean true if question with given ID exists
   */
  async checkIfQuestionExist(filterDto: GetQuestionDto) {
    return this.questionRepository.checkIfQuestionExist(filterDto);
  }

  /**
   * method to to clear local storage of programs
   * @async
   * @param Null
   * @returns boolean true if stored questions list is cleared
   */
  remove() {
    return this.questionRepository.clearStorage();
  }
}
