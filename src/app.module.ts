/**
 * This is the entry-point of the project, and all modules are summoned here.
 * When adding new functionality, if it does not fall under any of the already
 * defined modules, then new module would be integrated here.
 * @packageDocumentation
 */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { JudgeModule } from './judge/judge.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { ParticipantsModule } from './participants/participants.module';
import { ProblemsModule } from './problems/problems.module';
import { RunnerController } from './runner/runner.controller';
import { RunnerModule } from './runner/runner.module';
import { SyncModule } from './sync/sync.module';
import { TeamsModule } from './teams/teams.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';

/**
 * Main Application Module
 * @category Module
 */
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    RunnerModule,
    TeamsModule,
    ParticipantsModule,
    ProblemsModule,
    JudgeModule,
    SyncModule,
    AuthModule,
  ],
})

/** Attach custom middleware here */
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(RunnerController);
  }
}
