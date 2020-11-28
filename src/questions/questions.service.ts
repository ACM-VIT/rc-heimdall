import {
  Dependencies,
  HttpService,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetQuestionDto } from './dto/filter-question.dto';
import { QuestionRepository } from './questions.repository';
import * as config from 'config';
import { SeederObject } from './interface/seeder.interface';

@Injectable()
@Dependencies(HttpService)
export class QuestionsService {
  constructor(
    private readonly http: HttpService,
    private readonly seederEndpoint: string,
    private readonly taskRunnerEndpoint: string,
    private readonly logger = new Logger('questions'),

    @InjectRepository(QuestionRepository)
    private questionRepository: QuestionRepository,
  ) {
    this.seederEndpoint = config.get('seeder.endpoint');
    this.taskRunnerEndpoint = config.get('runner.seedEndpoint');
    this.logger.verbose('service initiated');
  }

  /**
   * Method to seed data from firebase cloud bucket
   * @async
   * @param Null
   * @returns Array containing id and url of questions currently in storage
   */
  async fetchQuestionsFromFirebase() {
    try {
      this.logger.verbose(`connecting to seeding endpoint: ${this.seederEndpoint} `);
      const reply = await this.http.get(this.seederEndpoint).toPromise();

      if (reply.status !== 200) {
        this.logger.error(`connecting to seeding endpoint: ${this.seederEndpoint}`);
        throw new ServiceUnavailableException(`Cannot connect to seeder`);
      }

      this.logger.verbose('Clearing local question storage');
      this.questionRepository.clearStorage();
      this.logger.verbose('Cleared local question storage');

      /** transform object into array */
      const questionDetails = reply.data.payload;
      this.logger.verbose(`Seeding questions into memory storage: ${questionDetails.length} total`);
      this.questionRepository.seedQuestionList(questionDetails);
      this.logger.verbose(`Seeding questions complete`);

      //   shoot and forget
      this.logger.verbose('Pinging task-runner to update storages');
      this.pingTaskRunnerToUpdateStorages();
      return reply.data;
    } catch (error) {
      this.logger.error('seeding questions into memory, throwing 500');
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
    this.logger.verbose(`checking if question with id:${filterDto.id} exists`);
    const questionExists: SeederObject = await this.questionRepository.checkIfQuestionExist(filterDto);
    if (!questionExists) {
      this.logger.verbose(`Question with id:${filterDto.id} does not exist`);
      throw new NotFoundException(`No question with id:${filterDto.id} exists`);
    }

    this.logger.verbose(`question with id:${filterDto.id} exists, sending info`);
    return questionExists;
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
  async pingTaskRunnerToUpdateStorages() {
    try {
      this.logger.verbose(`Pinging task-runner on ${this.taskRunnerEndpoint}`);
      const response = await this.http.get(this.taskRunnerEndpoint).toPromise();
      return [200, 201].includes(response.status);
    } catch (error) {
      this.logger.error('Problem connecting task-runner');
      return new InternalServerErrorException();
    }
  }
}
