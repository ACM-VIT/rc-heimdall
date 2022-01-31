import { Test, TestingModule } from '@nestjs/testing';
import { TCaseController } from './t-case.controller';

describe('TCaseController', () => {
  let controller: TCaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TCaseController],
    }).compile();

    controller = module.get<TCaseController>(TCaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
