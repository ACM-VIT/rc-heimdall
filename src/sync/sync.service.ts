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
import { JudgeService } from 'src/judge/judge.service';
import { ParticipantsService } from 'src/participants/participants.service';
import { TestCaseService } from 'src/testCase/testCase.service';
// import { TeamsService } from 'src/teams/teams.service';
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
    private readonly registrationEndpoint: string,

    /** initialize logger with context:seeder */
    private readonly logger = new Logger('seeder'),

    /** inject [[ProblemsService]] to seed data into [[ProblemRepository]]  */
    @Inject(ProblemsService)
    private readonly problemsService: ProblemsService,

    @Inject(ParticipantsService)
    private readonly participantService: ParticipantsService,

    @Inject(TestCaseService)
    private readonly testCaseService: TestCaseService,

    @Inject(JudgeService)
    private readonly judgeService: JudgeService,
  ) {
    this.seeder = config.get('seeder.endpoint');
    this.taskRunner = config.get('runner.seedEndpoint');
    this.registrationEndpoint = config.get('registration.endpoint');
    this.logger.verbose('Sync initialized');
  }

  /**
   * To sync database entries with problems uploaded on cloud storage
   */
  async syncWithCloudStorage() {
    await this.testCaseService.clear();
    this.logger.verbose(`Cleared testcases storages`);
    await this.judgeService.clear();
    this.logger.verbose(`cleared judge submissions`);
    await this.problemsService.clear();
    this.logger.verbose(`cleared problems list`);
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
          inputText1: problem.inputText1,
          inputText2: problem.inputText2,
          inputText3: problem.inputText3,
          inputText4: problem.inputText4,
          inputText5: problem.inputText5,
          outputText1: problem.outputText1,
          outputText2: problem.outputText2,
          outputText3: problem.outputText3,
          outputText4: problem.outputText4,
          outputText5: problem.outputText5,
          instructionsText: problem.instructionsText,
          inputFileURL: problem.input,
          outputFileURL: problem.output,
          instructionsFileURL: problem.instructions,
          windowsFileURL: problem.windows,
          objectFileURL: problem.object,
          macFileURL: problem.mac,
          multiplier: problem.multiplier ? problem.multiplier : 1,
          sampleInput: problem.sampleInput ? problem.sampleInput : 'sample input',
          sampleOutput: problem.sampleOutput ? problem.sampleOutput : 'sample output',
        });
      });

      this.logger.verbose(`Seeded ${parsedData.length} problems into storage`);

      this.logger.verbose('Pinging task-runner to update storages');

      return parsedData;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error seeding', error);
    }
  }

  async syncWithParticipants() {
    // try {
    this.logger.verbose(`Updating participant storages`);
    await this.testCaseService.clear();
    this.logger.verbose(`Cleared testcases storages`);
    await this.judgeService.clear();
    this.logger.verbose(`cleared judge submissions`);
    await this.participantService.clear();
    this.logger.verbose(`cleared participants list`);

    const { data } = await this.http
      .post(this.registrationEndpoint, {
        secret: config.get('roundone.secret'),
      })
      .toPromise();
    data.forEach(async (item) => {
      try {
        this.logger.verbose(`adding ${item.name} with ${item.googleID}`);
        await this.participantService.create({
          email: item.email,
          googleID: item.googleID,
          isAdmin: item.isAdmin,
          name: item.name,
          team: item.team,
          team_id: item.team_id,
        });
      } catch (e) {
        // console.log(e);
        this.logger.error(`Error adding ${item.name} / ${item.googleID}`);
      }
    });
    // } catch (e) {
    //   // console.log(e);
    //   this.logger.error('Error seeding participants');
    // }
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

    const keyArr = Object.keys(problems);

    for (let i = 0; i < keyArr.length; i += 1) {
      const Problem = problems[keyArr[i]];
      const testCases = Problem['test-cases'];

      this.logger.verbose(`Processing id:${keyArr[i]}`);
      const inputRequest1 = this.http.get(testCases['test-case-1']['input.txt'], { responseType: 'text' }).toPromise();
      const inputRequest2 = this.http.get(testCases['test-case-2']['input.txt'], { responseType: 'text' }).toPromise();
      const inputRequest3 = this.http.get(testCases['test-case-3']['input.txt'], { responseType: 'text' }).toPromise();
      const inputRequest4 = this.http.get(testCases['test-case-4']['input.txt'], { responseType: 'text' }).toPromise();
      const inputRequest5 = this.http.get(testCases['test-case-5']['input.txt'], { responseType: 'text' }).toPromise();
      const outputRequest1 = this.http
        .get(testCases['test-case-1']['output.txt'], { responseType: 'text' })
        .toPromise();
      const outputRequest2 = this.http
        .get(testCases['test-case-2']['output.txt'], { responseType: 'text' })
        .toPromise();
      const outputRequest3 = this.http
        .get(testCases['test-case-3']['output.txt'], { responseType: 'text' })
        .toPromise();
      const outputRequest4 = this.http
        .get(testCases['test-case-4']['output.txt'], { responseType: 'text' })
        .toPromise();
      const outputRequest5 = this.http
        .get(testCases['test-case-5']['output.txt'], { responseType: 'text' })
        .toPromise();
      const instructionRequest = this.http.get(Problem['description.txt'], { responseType: 'text' }).toPromise();
      const sampleInputRequest = this.http.get(Problem['sample-input.txt'], { responseType: 'text' }).toPromise();
      const sampleOutputRequest = this.http.get(Problem['sample-output.txt'], { responseType: 'text' }).toPromise();
      console.log(`${keyArr[i]}-windows.exe`);
      console.log(`${keyArr[i]}-linux.lin`);
      console.log(`${keyArr[i]}-mac.mac`);
      await Promise.all([
        inputRequest1,
        inputRequest2,
        inputRequest3,
        inputRequest4,
        inputRequest5,
        outputRequest1,
        outputRequest2,
        outputRequest3,
        outputRequest4,
        outputRequest5,
        instructionRequest,
        sampleInputRequest,
        sampleOutputRequest,
      ])
        .then((response) => {
          tasks.push({
            id: keyArr[i],
            input: Problem['sample-input.txt'],
            output: Problem['sample-output.txt'],
            instructions: Problem['description.txt'],
            windows: Problem['executables'][`${keyArr[i]}-windows.exe`],
            object: Problem['executables'][`${keyArr[i]}-linux.lin`],
            mac: Problem['executables'][`${keyArr[i]}-mac.mac`],
            inputText1: response[0].data,
            inputText2: response[1].data,
            inputText3: response[2].data,
            inputText4: response[3].data,
            inputText5: response[4].data,
            outputText1: response[5].data,
            outputText2: response[6].data,
            outputText3: response[7].data,
            outputText4: response[8].data,
            outputText5: response[9].data,
            multiplier: 1,
            instructionsText: response[10].data,
            sampleInput: response[11].data,
            sampleOutput: response[12].data,
          });
        })
        .catch((error) => {
          this.logger.error('Error fetching problem details', error);
        });
    }
    return tasks;
  }
}
