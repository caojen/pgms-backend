import { Global, Module } from '@nestjs/common';
import { QueryDbService } from './query-db.service';

@Global()
@Module({
  providers: [QueryDbService]
})
export class QueryDbModule {}
