import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { CreateProblemDto } from './dto/create-problem.dto';
import { ApiTags } from '@nestjs/swagger';

/**
 * **Problems Controller**
 *
 * All routes related to problems are declared here, and the decorators represent the type of request
 * they respond to. Use ValidationPipe to validate client requests, and the rules for validation are
 * defined in [[CreateProblemDto]].
 *
 * The controller calls [[ProblemsService]] for all operations.
 *
 * @category Problems
 */
@ApiTags('Problems')
@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  /**
   * Responds to: _POST(`/`)_
   *
   * To create a new problem using [[CreateProblemDto]]
   */
  @Post()
  create(@Body() createProblemDto: CreateProblemDto) {
    return this.problemsService.create(createProblemDto);
  }

  /**
   * Responds to: _GET(`/`)_
   *
   * To return list of all problems. This is for internal use only.
   */
  @Get()
  findAll() {
    return this.problemsService.findAll();
  }

  /**
   * Responds to: _GET(`/:id`)_
   *
   * To return details of a particular problem. This does not expose sensitive details
   * like inputText or outputText, but only download links and problem details
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.problemsService.findOne(id);
  }

  /**
   * Responds to: _DELETE(`/:id`)_
   *
   * To delete a problem by ID
   */
  //   @Delete(':id')
  //   remove(@Param('id') id: string) {
  //     return this.problemsService.remove(id);
  //   }
}
