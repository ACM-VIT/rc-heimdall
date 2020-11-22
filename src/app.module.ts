import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { QuestionsModule } from './questions/questions.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), QuestionsModule],
})
export class AppModule {}
