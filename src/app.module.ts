import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueryDbModule } from './query-db/query-db.module';
import { UserModule } from './user/user.module';
import { EndeModule } from './ende/ende.module';

@Module({
  imports: [QueryDbModule, UserModule, EndeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
