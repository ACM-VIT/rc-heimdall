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
    private readonly seederEndpoint: string,
    private readonly taskRunnerEndpoint: string,

    @InjectRepository(QuestionRepository)
    private questionRepository: QuestionRepository,
  ) {
    this.seederEndpoint = config.get('seeder.endpoint');
    this.taskRunnerEndpoint = config.get('runner.seedEndpoint');
  }

  /**
   * Method to seed data from firebase cloud bucket
   * @async
   * @param Null
   * @returns Array containing id and url of questions currently in storage
   */
  async fetchQuestionsFromFirebase() {
    try {
      const reply = await this.http.get(this.seederEndpoint).toPromise();
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

      //   shoot and forget
      this.pingTaskRunnerToUpdateStorages();
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

  /**
   * Function to shoot a request to task-runner so that it updates it's arsenal of
   * binaries to run code on.
   * @description The reason that this is not an async function, and we do not care about
   * the reply from the task-runner is that it is not the job of this service to ensure that
   * task-runner does what it is expected to do. The download can take a few minutes which can
   * cause a timeout on some connections. To avoid that, we rely on task-runner to download the
   * files, and just to inform the user, we send a 202 to denote that the request is accepted.
   * @returns boolean true if request was shot at task-runner
   */
  pingTaskRunnerToUpdateStorages() {
    try {
      this.http.get(this.taskRunnerEndpoint).toPromise();
      return true;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
