import { Test, TestingModule } from '@nestjs/testing';
import { RunnerController } from './runner.controller';
import { RunnerService } from './runner.service';

describe('RunnerController', () => {
  let controller: RunnerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RunnerController],
      providers: [RunnerService],
    }).compile();

    controller = module.get<RunnerController>(RunnerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
