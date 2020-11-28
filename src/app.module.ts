import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { QuestionsController } from './questions/questions.controller';
import { QuestionsModule } from './questions/questions.module';
import { RunnerController } from './runner/runner.controller';
import { RunnerModule } from './runner/runner.module';
import { TeamsModule } from './teams/teams.module';
import { ParticipantsModule } from './participants/participants.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    QuestionsModule,
    RunnerModule,
    TeamsModule,
    ParticipantsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(QuestionsController, RunnerController);
  }
}
