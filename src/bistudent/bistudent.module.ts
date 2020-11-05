import { Module } from '@nestjs/common';
import { BistudentService } from './bistudent.service';
import { BistudentController } from './bistudent.controller';

@Module({
  providers: [BistudentService],
  controllers: [BistudentController]
})
export class BistudentModule {}
