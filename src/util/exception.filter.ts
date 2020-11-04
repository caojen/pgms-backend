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

  // catch exception, will throw to here...
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const user = request["user"];
    const uid = user ? user.uid : null;
    const ip = request.socket.remoteAddress;
    const url = request.url;
    const method = request.method;
    const status = exception.status;
    const responseText = JSON.stringify(exception.response);
    const userType = this.getUserType(user);

    // write to database:
    const sql = `
      INSERT INTO logger (ip, url, uid, response_body, response_status, usertype, method)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    this.queryDb(sql, [ip, url, uid, responseText, status, userType, method]);

    response
      .status(exception.status)
      .json(exception.response);
  }

  getUserType(user: any) {
    if(!user) {
      return null;
    } else {
      const enums = ['student', 'teacher', 'admin', 'bistuent'];
      for(const item in enums) {
        if(!!user[enums[item]]) {
          return enums[item];
        }
      }
    }
  }
}
