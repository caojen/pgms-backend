import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueryDbModule } from './query-db/query-db.module';

@Module({
  imports: [QueryDbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
