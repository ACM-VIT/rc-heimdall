import {
  Dependencies,
  HttpService,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import * as config from 'config';
import { ProblemsService } from '../problems/problems.service';
import { ProblemMetadata } from './interface/problem.interface';

/**
 * **Sync  Service**
 *
 * Sync Service contains all logic related to ensure that all micro services share the
 * data and therefore can interact with each other hassle-free.
 *
 * @category Sync
 */
@Injectable()
@Dependencies(HttpService)
export class SyncService {
  constructor(
    /** [[HttpService]] to make HTTP calls to storage lambda endpoint */
    private readonly http: HttpService,

    /** endpoints for API Calls */
    private readonly seeder: string,
    private readonly taskRunner: string,

    /** initialize logger with context:seeder */
    private readonly logger = new Logger('seeder'),

    /** inject [[ProblemsService]] to seed data into [[ProblemRepository]]  */
    @Inject(ProblemsService)
    private readonly problemsService: ProblemsService,
  ) {
    this.seeder = config.get('seeder.endpoint');
    this.taskRunner = config.get('runner.seedEndpoint');

    this.logger.verbose('Sync initialized');
  }

  /**
   * To sync database entries with problems uploaded on cloud storage
   */
  async syncWithCloudStorage() {
    try {
      this.logger.verbose(`connecting to seeding endpoint: ${this.seeder} `);
      const reply = await this.http.get(this.seeder).toPromise();

      if (reply.status !== 200) {
        this.logger.error(`connecting to seeding endpoint: ${this.seeder}`);
        throw new ServiceUnavailableException(`Cannot connect to seeder`);
      }

      /** transform object into array */
      const problems = reply.data.payload;
      this.logger.verbose('Displaying problem details');

      /** save problem details locally and return data as string object */
      const parsedData = await this.saveLocally(problems);

      /** clear old storage */
      const clearOperation = await this.problemsService.clear();
      this.logger.verbose(`Cleared ${clearOperation.affected} from problem storage`);

      parsedData.forEach((problem) => {
        this.problemsService.create({
          name: problem.id,
          maxPoints: 100,
          inputText: problem.inputText.replace(/\n/g, ' '),
          outputText: problem.outputText.replace(/\n/g, ' '),
          instructionsText: problem.instructionsText.replace(/\n/g, ' '),
          inputFileURL: problem.input,
          outputFileURL: problem.output,
          instructionsFileURL: problem.instructions,
          windowsFileURL: problem.windows,
          objectFileURL: problem.object,
        });
      });

      this.logger.verbose(`Seeded ${parsedData.length} problems into storage`);

      //   const taskRunnerStatus = await this.pingTaskRunnerToUpdateStorages();
      this.logger.verbose('Pinging task-runner to update storages');

      return parsedData;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error seeding', error);
    }
  }

  /**
   * Function to shoot a request to task-runner so that it updates it's arsenal of
   * binaries to run code on.
   *
   * The reason that this is not an async function, and we do not care about
   * the reply from the task-runner is that it is not the job of this service to ensure that
   * task-runner does what it is expected to do. The download can take a few minutes which can
   * cause a timeout on some connections. To avoid that, we rely on task-runner to download the
   * files, and just to inform the user, we send a 202 to denote that the request is accepted.
   *
   */
  async pingTaskRunnerToUpdateStorages(): Promise<boolean> {
    try {
      this.logger.verbose(`Pinging task-runner on ${this.taskRunner}`);
      const response = await this.http.get(this.taskRunner).toPromise();
      return [200, 201].includes(response.status);
    } catch (error) {
      this.logger.error('Problem connecting task-runner');
      throw new InternalServerErrorException('Task Runner not responding');
    }
  }

  /**
   * **Save Locally**
   *
   * This method is responsible for making API Calls to the storage lambda, fetch
   * input, output and instruction as plain text.
   */
  private async saveLocally(problems: Array<ProblemMetadata>): Promise<Array<ProblemMetadata>> {
    const tasks: Array<ProblemMetadata> = [];
    for (let i = 0; i < problems.length; i += 1) {
      this.logger.verbose(`Processing id:${problems[i].id}`);
      const inputRequest = this.http.get(problems[i].input, { responseType: 'text' }).toPromise();
      const outputRequest = this.http.get(problems[i].output, { responseType: 'text' }).toPromise();
      const instructionRequest = this.http.get(problems[i].instructions, { responseType: 'text' }).toPromise();
      await Promise.all([inputRequest, outputRequest, instructionRequest]).then((response) => {
        tasks.push({
          id: problems[i].id,
          input: problems[i].input,
          output: problems[i].output,
          instructions: problems[i].instructions,
          windows: problems[i].windows,
          object: problems[i].object,
          inputText: response[0].data,
          outputText: response[1].data,
          instructionsText: response[2].data,
        });
      });
    }
    return tasks;
  }
}
