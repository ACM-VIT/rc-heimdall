import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual } from 'typeorm';
import { CreateProblemDto } from './dto/create-problem.dto';
import { ProblemRepository } from './problems.repository';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectRepository(ProblemRepository)
    private readonly problemRepository: ProblemRepository,
  ) {}

  create(createProblemDto: CreateProblemDto) {
    return this.problemRepository.save(createProblemDto);
  }

  findAll() {
    return this.problemRepository.find();
  }

  async findOne(id: string) {
    try {
      const problem = await this.problemRepository.findAndFilter(id);
      return problem;
    } catch (e) {
      throw new NotFoundException(`Invalid QuestionID :${id}`);
    }
  }

  async findOneForJudge(id: string) {
    try {
      const problem = await this.problemRepository.findOneForJudge(id);
      return problem;
    } catch (e) {
      throw new BadRequestException(`Invalid QuestionID :${id}`);
    }
  }

  remove(id: string) {
    return this.problemRepository.delete({ id });
  }

  /** delete all standard questions */
  clear() {
    return this.problemRepository.delete({ maxPoints: MoreThanOrEqual(0) });
  }
}
