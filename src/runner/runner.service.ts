import * as config from 'config';

import { Dependencies, HttpService, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { ExecuteCodeDto } from './dto/execute-code.dto';
import { ProblemsService } from '../problems/problems.service';
import { exec } from 'child_process';

/**
 * **Runner Service**
 *
 * Runner Service contains all business logic related to code-runner, and is designed to be
 * imported and re-used in other modules. Therefore it is to ensure that all methods of the service
 * are self-contained and fit to be used directly as per use-case.
 *
 * @category Runner
 */
@Injectable()
@Dependencies(HttpService)
export class RunnerService {
  /** import http service to make web requests to task-runner */
  constructor(
    /** [[HttpService]] to make HTTP calls to task runner */
    private readonly http: HttpService,

    /** endpoint to make http calls at */
    private readonly endpoint: string,

    /** initiate logger with context:`runner` */
    private readonly logger = new Logger('runner'),

    @Inject(ProblemsService)
    private readonly problemService: ProblemsService,
  ) {
    this.endpoint = config.get('runner.runEndpoint');
    this.logger.verbose('service initialized');
    this.logger.verbose(`runner endpoint: ${this.endpoint}`);
  }

  /**
   * Method to fetch code output from task-runner by making a POST request to the
   * task-runner /run endpoint.
   *
   * **Response**
   * - InternalServerErrorException(500) when faces error while processing request
   * - ServiceUnavailableException(503) when faces too many requests at same time
   *
   * @see TaskRunner for more details about code execution service. https://github.com/YashKumarVerma/rc-task-runner
   */
  async execute(executeCode: ExecuteCodeDto): Promise<string> {
    try {
      // fetch output from task-runner, if error, then return normal string.
      this.logger.verbose(`Requesting runner with data: ${JSON.stringify(executeCode)}`);

      // fetch question name by uuid
      const problemName = await this.problemService.getNameFromId(executeCode.id);
      if (problemName === undefined) {
        throw new NotFoundException(`Question ID Not found`);
      }

      /** generate name in format accepted by task-runner */
      const postBody = {
        id: `${problemName}.out`,
        input: executeCode.input,
      };
      this.logger.verbose(`Query task runner with ${JSON.stringify(postBody)}`);

      const reply = await this.http.post(this.endpoint, postBody).toPromise();
      return reply.data.output;
    } catch (err) {
      this.logger.warn(`Question with id :${executeCode.id} not found`);
      throw new NotFoundException(`Question Not Found`);
    }
  }
}
