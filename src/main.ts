import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as rateLimit from 'express-rate-limit';
import { requestListening } from './util/request.middleware';
import { RequestInterceptor } from './util/request.interceptor';
import { HttpExceptionFilter } from './util/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // limit each ip to 200 request per 15mins
  const limiter = rateLimit({
    windowMs: 15*60*1000,
    max: 200,
  });
  app.use(limiter);

  app.use(requestListening);
  app.useGlobalInterceptors(new RequestInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(5001);
}
bootstrap();
