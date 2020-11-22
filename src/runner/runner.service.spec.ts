import { Test, TestingModule } from '@nestjs/testing';
import { RunnerService } from './runner.service';

describe('RunnerService', () => {
  let service: RunnerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RunnerService],
    }).compile();

    service = module.get<RunnerService>(RunnerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
