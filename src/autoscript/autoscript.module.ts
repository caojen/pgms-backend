import { Module } from '@nestjs/common';
import { AutoscriptService } from './autoscript.service';

@Module({
  providers: [AutoscriptService]
})
export class AutoscriptModule {}
