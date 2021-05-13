import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { requestListening } from './util/request.middleware';
import { RequestInterceptor } from './util/request.interceptor';
import { HttpExceptionFilter } from './util/exception.filter';
import * as express from 'express';
import { rateLimit } from './util/rateLimit.middleware';
import * as config from '../config.json'


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prefix = '/'

  app.use(requestListening);
  app.use(rateLimit);
  app.useGlobalInterceptors(new RequestInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.use('/', express.static('template/dist'));

  app.setGlobalPrefix(prefix);
  app.use(`${prefix}/doc`, express.static('doc'));
  // 允许跨域：
  // app.use('/', function(req, res: express.Response, next) {
  //   res.setHeader('Access-Control-Allow-Credentials', 'true');
  //   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  //   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  //   res.setHeader('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  //   next();
  // });

  if(!config.secure) {
    app.enableCors({
      origin: 'http://127.0.0.1:8081',
      credentials: true
    });
  }

  await app.listen(5001);
}
bootstrap();
