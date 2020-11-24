import { Dependencies, HttpService, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ExecuteCodeDto } from './dto/execute-code.dto';
import * as config from 'config';

@Injectable()
@Dependencies(HttpService)
export class RunnerService {
  /** import http service to make web requests to task-runner */
  constructor(
    private readonly http: HttpService,
    private readonly endpoint: string,
    private readonly logger = new Logger('runner'),
  ) {
    this.endpoint = config.get('runner.runEndpoint');
    this.logger.verbose('service initialized');
    this.logger.verbose(`runner endpoint: ${this.endpoint}`);
  }

  /**
   * Method to fetch code output from task-runner by making a POST request to the
   * task-runner /run endpoint.
   *
   * @async
   * @param executeCode Object containing {id, input} of program to run
   * @returns Promise<string> that contains output of code
   * @throws InternalServerErrorException(500) when faces error while processing request
   * @throws ServiceUnavailableException(503) when faces too many requests at same time
   * @see TaskRunner for more details about code execution service. https://github.com/YashKumarVerma/rc-task-runner
   */
  async execute(executeCode: ExecuteCodeDto): Promise<string> {
    try {
      const postBody = {
        id: executeCode.id,
        input: executeCode.input,
      };

      // fetch output from task-runner, if error, then return normal string.
      this.logger.verbose(`Requesting runner with data: ${JSON.stringify(executeCode)}`);
      const reply = await this.http.post(this.endpoint, postBody).toPromise();
      return reply.data;
    } catch (err) {
      this.logger.warn(`Question with id :${executeCode.id} not found`);
      throw new NotFoundException(`Question Not Found`);
    }
  }
}
