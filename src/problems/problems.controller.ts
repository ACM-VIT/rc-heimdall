import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { CreateProblemDto } from './dto/create-problem.dto';
import { ApiTags } from '@nestjs/swagger';

/**
 * Problems Controller
 * @description: Entry point of problems routes
 */
@ApiTags('Problems')
@Controller('problems')
export class ProblemsController {
  /**
   * @constructor
   * @description: Load business logic to be used for controller methods
   * @param problemsService Instance of ProblemsService to perform business logic related to problems
   */
  constructor(private readonly problemsService: ProblemsService) {}

  @Post()
  create(@Body() createProblemDto: CreateProblemDto) {
    return this.problemsService.create(createProblemDto);
  }

  @Get()
  findAll() {
    return this.problemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.problemsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.problemsService.remove(id);
  }
}
