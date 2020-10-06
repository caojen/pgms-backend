import { Module } from '@nestjs/common';
import { EndeService } from './ende.service';

@Module({
  providers: [EndeService]
})
export class EndeModule {}
