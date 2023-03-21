import { Controller, Get, Post, Body, Param, UseGuards, Request, Delete, Req } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { CreateProblemDto } from './dto/create-problem.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

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
@ApiBearerAuth('access-token')
@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  /**
   * Responds to: _POST(`/`)_
   *
   * To create a new problem using [[CreateProblemDto]]
   */
  // @UseGuards(JwtAuthGuard)
  // @Post()
  // create(@Body() createProblemDto: CreateProblemDto) {
  //   return this.problemsService.create(createProblemDto);
  // return [];
  // }

  /**
   * Responds to: _GET(`/`)_
   *
   * To return list of all problems. This does not expose sensitive details
   * like inputText or outputText
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    try {
      return this.problemsService.findAll();
    } catch (error) {
      return error;
    }
    // return [];
  }

  /** Route to get round 2 problems */
  @UseGuards(JwtAuthGuard)
  @Get('/round2')
  findAssigned(@Req() req) {
    try {
      console.log('yes');
      return this.problemsService.findAssigned(req.user.teamId);
    } catch (error) {
      return error;
    }
  }

  /**
   * Responds to: _GET(`/:id`)_
   *
   * To return details of a particular problem. This does not expose sensitive details
   * like inputText or outputText, but only download links and problem details
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    const teamId: number = req.user.teamId;
    return this.problemsService.getProblem(teamId, id);
  }

  /**
   * Responds to: _DELETE(`/:id`)_
   *
   * To delete a problem by ID
   */
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.problemsService.remove(id);
  // }
}
