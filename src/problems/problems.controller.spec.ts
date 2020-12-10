import { CreateProblemDto } from './dto/create-problem.dto';
import { Problems } from './problem.entity';
import { ProblemsController } from './problems.controller';
import { ProblemsService } from './problems.service';
import { Test } from '@nestjs/testing';

describe('ProblemsController', () => {
  let problemController: ProblemsController;
  let problemService: ProblemsService;
  const problem = {
    name: 'problem_example',
    maxPoints: 0,
    inputFileURL: 'string',
    outputFileURL: 'string',
    windowsFileURL: 'string',
    objectFileURL: 'string',
    instructionsFileURL: 'string',
    inputText: 'string',
    outputText: 'string',
    instructionsText: 'string',
  };

  let problemObject: Problems;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProblemsController],
      providers: [
        {
          provide: ProblemsService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              ...problem,
            }),

            findAll: jest.fn().mockResolvedValue([
              {
                ...problem,
              },
              {
                ...problem,
              },
            ]),

            create: jest.fn().mockImplementation((problem: CreateProblemDto) => {
              Promise.resolve({ id: 'uuid', ...problem });
            }),

            getNameFromId: jest.fn().mockImplementation((id: string) => {
              Promise.resolve({ name: `problem_${id}` });
            }),

            findOneForJudge: jest.fn().mockResolvedValue({
              ...problem,
            }),

            remove: jest.fn().mockImplementation((id: string) => {
              Promise.resolve({ affected: 2, id });
            }),

            clear: jest.fn().mockResolvedValue((id: string) => {
              Promise.resolve({ affected: 2, id });
            }),
          },
        },
      ],
    }).compile();

    problemObject = await new Problems();
    problemObject.name = 'problem_example';
    problemObject.maxPoints = 0;
    problemObject.inputFileURL = 'string';
    problemObject.outputFileURL = 'string';
    problemObject.windowsFileURL = 'string';
    problemObject.objectFileURL = 'string';
    problemObject.instructionsFileURL = 'string';
    problemObject.inputText = 'string';
    problemObject.outputText = 'string';
    problemObject.instructionsText = 'string';
    problemObject.id = '8c4c483c-40fb-4335-b207-163d4fdc5f8a';

    problemController = moduleRef.get<ProblemsController>(ProblemsController);
    problemService = moduleRef.get<ProblemsService>(ProblemsService);
  });

  it('should be defined', () => {
    expect(problemController).toBeDefined();
  });

  describe('create', () => {
    it('should return details of newly created problem', async () => {
      const createProblemDto: CreateProblemDto = {
        ...problem,
      };

      jest.spyOn(problemService, 'create').mockImplementation(async () => problemObject);
      expect(await problemController.create(createProblemDto)).toBe(problemObject);
    });
  });

  describe('findAll', () => {
    it('should return array of  problems', async () => {
      const problems = [problemObject, problemObject];
      jest.spyOn(problemService, 'findAll').mockImplementation(async () => problems);
      expect(await problemController.findAll()).toBe(problems);
    });
  });

  describe('findOne', () => {
    it('should return details of problem by id', async () => {
      jest.spyOn(problemService, 'findOne').mockImplementation(async () => problemObject);
      expect(await problemController.findOne('id')).toBe(problemObject);
    });
  });
});
