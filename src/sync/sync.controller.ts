import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { SyncService } from './sync.service';

/**
 * **Sync Controller**
 *
 * All routes related to data synchronization are declared here, and the decorators represent the type of request
 * they respond to. Use ValidationPipe to validate client requests.
 *
 * The controller calls [[SyncService]] for all operations.
 *
 * @category Problems
 */

@ApiTags('Data Synchronization')
@ApiBearerAuth('access-token')
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  /**
   * Responds to: _GET(`/problems`)_
   *
   * To fetch and update database with problem details fetched from storage lambda
   */
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
  @UseGuards(JwtAuthGuard)
  @Get('/problems')
  @HttpCode(202)
  seedProblems() {
    return this.syncService.syncWithCloudStorage();
  }
}
