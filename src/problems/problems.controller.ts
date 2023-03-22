import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Round2Guard } from 'src/auth/guards/round2.guard';

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
@UseGuards(JwtAuthGuard)
@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  /**
   * Responds to: _GET(`/`)_
   *
   * To return list of all problems. This does not expose sensitive details
   * like inputText or outputText
   */
  @Get()
  findAll() {
    return this.problemsService.findAll();
  }

  /** Route to get round 2 problems */
  @UseGuards(Round2Guard)
  @Get('/round2')
  findAssigned(@Req() req) {
    return this.problemsService.findAssigned(req.user.teamId);
  }

  /**
   * Responds to: _GET(`/:id`)_
   *
   * To return details of a particular problem. This does not expose sensitive details
   * like inputText or outputText, but only download links and problem details including Submision testCases
   */
  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.problemsService.getProblem(req.user.teamId, id);
  }
}
