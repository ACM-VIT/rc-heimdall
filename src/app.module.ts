/**
 * This is the entry-point of the project, and all modules are summoned here.
 * When adding new functionality, if it does not fall under any of the already
 * defined modules, then new module would be integrated here.
 * @packageDocumentation
 */
import { MiddlewareConsumer, Module, NestModule, RequestMethod, CacheModule } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
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
import { TestCaseModule } from './testCase/testCase.module';
import { PauseMiddleware } from './middlewares/pause.middleware';
import { AdminModule } from './admin/admin.module';

/**
 * Main Application Module
 * @category Module
 */
@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 15,
    }),
    CacheModule.register({
      ttl: 0,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    RunnerModule,
    TeamsModule,
    ParticipantsModule,
    TestCaseModule,
    ProblemsModule,
    JudgeModule,
    SyncModule,
    AuthModule,
    AdminModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})

/** Attach custom middleware here */
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(RunnerController);
    // apply on all POST routes
    consumer.apply(PauseMiddleware).forRoutes({
      path: '/judge',
      method: RequestMethod.POST,
    });
  }
}
