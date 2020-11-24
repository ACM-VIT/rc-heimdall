import {
  Dependencies,
  HttpService,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetQuestionDto } from './dto/filter-question.dto';
import { QuestionRepository } from './questions.repository';
import * as config from 'config';

@Injectable()
@Dependencies(HttpService)
export class QuestionsService {
  constructor(
    private readonly http: HttpService,
    private readonly endpoint: string,

    @InjectRepository(QuestionRepository)
    private questionRepository: QuestionRepository,
  ) {
    this.endpoint = config.get('seeder.endpoint');
  }

  /**
   * Method to seed data from firebase cloud bucket
   * @async
   * @param Null
   * @returns Null
   */
  async fetchQuestionsFromFirebase() {
    try {
      const reply = await this.http.get(this.endpoint).toPromise();
      if (reply.status !== 200) {
        throw new ServiceUnavailableException(`Cannot connect to seeder`);
      }
      //   clear old question indexes
      this.questionRepository.clearStorage();

      //   generate list of all questions
      const questionDetails = reply.data.payload;
      this.questionRepository.seedQuestionList(
        questionDetails.map(question => {
          return question.id;
        }),
      );

      return reply.data;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error seeding');
    }
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
}
