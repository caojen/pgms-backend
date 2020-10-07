import { Module } from '@nestjs/common';
import { QueryDbService } from 'src/query-db/query-db.service';
import { AutoscriptService } from './autoscript.service';

@Module({
  providers: [AutoscriptService, QueryDbService]
})
export class AutoscriptModule {}
