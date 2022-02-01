import { Controller, Body, Put, Logger, Get } from '@nestjs/common';
import { TestCaseService } from './testCase.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { JwtToken } from '../auth/interface/auth.token.interface';
import { Judge0Callback } from './interface/judge0.interfaces';
import { DILUTE } from './enum/codeStates.enum';

@ApiTags('TestCase')
@ApiBearerAuth('access-token')
@Controller('testcase')
export class TestCaseController {
  /** initialize the logger with judge context */
  private readonly logger = new Logger('testcase');
  constructor(private readonly testCaseService: TestCaseService) {}
  @Put('QAEJCC9JjMfdAQZ4dTTNfVNF9jUHA3UW')
  callbackHandler(@Body() judge0Callback: Judge0Callback) {
    console.log('Callback triggered');
    this.logger.verbose(`> ${judge0Callback.token} :: ${DILUTE[judge0Callback.status.id]}`);
    return this.testCaseService.handleCallback(judge0Callback);
  }

  @Get()
  getAll() {
    return this.testCaseService.getAll();
  }
}
