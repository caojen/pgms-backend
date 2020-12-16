import { APP_FILTER, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as rateLimit from 'express-rate-limit';
import { requestListening } from './util/request.middleware';
import { RequestInterceptor } from './util/request.interceptor';
import { HttpExceptionFilter } from './util/exception.filter';
import * as express from 'express';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // limit each ip to 200 request per 15mins
  // const limiter = rateLimit({
  //   windowMs: 15*60*1000,
  //   max: 200,
  // });
  // app.use(limiter);

  app.use(requestListening);
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
