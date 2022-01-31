import { Module } from '@nestjs/common';
import { TCaseService } from './t-case.service';
import { TCaseController } from './t-case.controller';

@Module({
  providers: [TCaseService],
  controllers: [TCaseController]
})
export class TCaseModule {}
