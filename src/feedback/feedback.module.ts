import { Module } from '@nestjs/common';
import { EndeService } from 'src/ende/ende.service';
import { QueryDbService } from 'src/query-db/query-db.service';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService, QueryDbService, EndeService]
})
export class FeedbackModule {}
