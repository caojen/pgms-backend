import { ExceptionFilter, Catch, ArgumentsHost, Logger, HttpException } from '@nestjs/common';
import { Response, Request } from 'express';
import * as database from '../../database.json';
import * as global from "../../config.json";
import * as mysql from 'mysql2/promise';
import { getUserType } from './global.funtions';
import { getIp } from './global.funtions';

const config = database[global.env];

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {

  private executePool: mysql.Pool = null;
  private readonly logger = new Logger('ExceptionFilter')

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
    try {
      return (await this.executePool.query(sql, params))[0] as any[];
    } catch (e) {
      throw new HttpException({msg: '数据库查询出错'}, 500);
    }
  }

  // catch exception, will throw to here...
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const user = request["user"];
    const uid = user ? user.uid : null;
    const ip = getIp(request);
    const url = request.url;
    const method = request.method;
    const status = exception.status;
    const responseText = JSON.stringify(exception.response);
    const userType = getUserType(user);

    // write to database:
    const sql = `
      INSERT INTO logger (ip, url, uid, response_body, response_status, usertype, method)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    this.queryDb(sql, [ip, url, uid, (responseText == null ? '<null body>' : responseText), ((status == null || status == undefined) ? 500 : status), userType, method]);

    response
      .status(exception.status ? exception.status : 500)
      .json(exception.response);
  }
}
