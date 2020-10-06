import { Module } from '@nestjs/common';
import { QueryDbService } from './query-db.service';

@Module({
  providers: [QueryDbService]
})
export class QueryDbModule {}
