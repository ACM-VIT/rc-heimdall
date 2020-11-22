import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { QuestionsModule } from './questions/questions.module';
import { RunnerModule } from './runner/runner.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    QuestionsModule,
    RunnerModule,
  ],
})
export class AppModule {}
