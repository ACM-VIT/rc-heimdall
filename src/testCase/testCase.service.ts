import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual } from 'typeorm';
import { Judge0Callback } from './interface/judge0.interfaces';
import { TestCaseRepository } from './testcase.repository';

@Injectable()
export class TestCaseService {
  handleCallback(judge0Callback: Judge0Callback) {
      throw new Error('Method not implemented.');
  }
  /** injecting imported modules and services into problem service */
  constructor(
    /** injecting [[ProblemRepository]] as a persistence layer */
    @InjectRepository(TestCaseRepository)
    private readonly testCaseRepository: TestCaseRepository,
  ) {}
}
