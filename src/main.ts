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
  const prefix = ''

  app.use(requestListening);
  app.use(rateLimit);
  app.useGlobalInterceptors(new RequestInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.use('/', express.static('template/dist'));

  app.setGlobalPrefix(prefix);
  app.use(`${prefix}/doc`, express.static('doc'));
  // 允许跨域：
  app.use('/', function(req: express.Request, res: express.Response, next) {

    const origin = req.headers.origin;

    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.setHeader('Access-Control-Max-Age', '36000');

    if (req.method.toLowerCase() === 'options') {
      res.status(204);
      res.end(); 
    } else {
      next();
    }
  });

  await app.listen(5100);
}
bootstrap();
