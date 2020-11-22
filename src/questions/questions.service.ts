import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
   * @throws NotFoundException when given question does not exist
   */
  async checkIfQuestionExist(filterDto: GetQuestionDto) {
    const questionExists = await this.questionRepository.checkIfQuestionExist(
      filterDto,
    );
    if (questionExists !== true) {
      throw new NotFoundException(`No question with id:${filterDto.id} exists`);
    }
    return true;
  }

  /**
   * method to to clear local storage of programs
   * @async
   * @param Null
   * @returns boolean true if stored questions list is cleared
   * @throws InternalServerErrorException when operation fails
   */
  async clearStoredQuestionList() {
    const clearTaskStatus = await this.questionRepository.clearStorage();
    if (clearTaskStatus !== true) {
      throw new InternalServerErrorException(`Error while clearing data`);
    }
    return true;
  }
}
