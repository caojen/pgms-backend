import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response, Request } from 'express';
import * as database from '../../database.json';
import * as mysql from 'mysql2/promise';

const config = database.test;

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {

  private executePool: mysql.Pool = null;

  constructor() {
    this.executePool = mysql.createPool({
      host: config.host,
      user: config.user,
      database: config.database,
      password: config.password,
      connectionLimit: 20,
      waitForConnections: true,
      queueLimit: 0
    });
  }

  async queryDb(sql: string, params: any[]) {
    return (await this.executePool.query(sql, params))[0] as any[];
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const user = request["user"];
    const username = user ? user.username : "NOT LOGIN";
    const ip = request.socket.remoteAddress;
    const url = request.url;
    const status = exception.status;
    const responseText = exception.response;

    response
      .status(exception.status)
      .json(exception.response);
  }
}
