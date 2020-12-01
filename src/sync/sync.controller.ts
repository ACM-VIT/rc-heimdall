import { Controller, Get, HttpCode } from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiServiceUnavailableResponse,
} from '@nestjs/swagger';
import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @ApiAcceptedResponse({
    status: 202,
    description: 'The request has been accepted and all services will update their references.',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'The service responsible for running binaries online is not responding',
  })
  @ApiServiceUnavailableResponse({
    status: 503,
    description: 'The service responsible to provide details about problems cannot be connected',
  })
  @Get('/problems')
  @HttpCode(202)
  seedProblems() {
    return this.syncService.syncWithCloudStorage();
  }

  //   @Get(':id')
  //   checkIfQuestionExists(@Param('id') id: string) {
  //     return this.questionsService.checkIfQuestionExist({ id });
  //   }
}
