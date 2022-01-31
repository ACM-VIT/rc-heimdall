import { Test, TestingModule } from '@nestjs/testing';
import { TCaseService } from './t-case.service';

describe('TCaseService', () => {
  let service: TCaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TCaseService],
    }).compile();

    service = module.get<TCaseService>(TCaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
