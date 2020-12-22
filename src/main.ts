import { APP_FILTER, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { requestListening } from './util/request.middleware';
import { RequestInterceptor } from './util/request.interceptor';
import { HttpExceptionFilter } from './util/exception.filter';
import * as express from 'express';
import { rateLimit } from './util/rateLimit.middleware';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(requestListening);
  app.use(rateLimit);
  app.useGlobalInterceptors(new RequestInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.use('/doc', express.static('doc'));
  // 允许跨域：
  // app.use('/', function(req, res: express.Response, next) {
  //   res.setHeader('Access-Control-Allow-Credentials', 'true');
  //   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  //   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  //   res.setHeader('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  //   next();
  // });

  app.enableCors({
    origin: 'http://localhost:8080',
    credentials: true
  });

  await app.listen(5001);
}
bootstrap();
