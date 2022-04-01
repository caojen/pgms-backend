//! 全局拦截器
//! 记录了能够正常通过权限访问的请求
//! 正常访问下, 将不会记录response的body

import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as global from "../../config.json";
import * as mysql from 'mysql2/promise';
import { getUserType } from './global.funtions';
import { getIp } from './global.funtions';


@Injectable()
export class RequestInterceptor implements NestInterceptor {
  private readonly logger = new Logger("Interceptor");
  private executePool: mysql.Pool = null;

  constructor() {
    this.executePool = mysql.createPool({
      host: process.env["MYSQL_HOST"],
      user: process.env["MYSQL_PORT"],
      database: process.env["MYSQL_DATABASE"],
      password: process.env["MYSQL_PASSWORD"],
      connectionLimit: 20,
      waitForConnections: true,
      queueLimit: 0
    });
  }

  async queryDb(sql: string, params: any[]) {
    return (await this.executePool.query(sql, params))[0] as any[];
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request["user"];
    const uid = user ? user.uid : null;
    const ip = getIp(request);
    const method = request.method;
    const url = request.url;
    const responseText = '';
    const status = 200;
    const userType = getUserType(user);

    return next
      .handle()
      .pipe(
        tap(() => {
          const sql = `
            INSERT INTO logger (ip, url, uid, response_body, response_status, usertype, method)
            VALUES (?, ?, ?, ?, ?, ?, ?);
          `;
          this.queryDb(sql, [ip, url, uid, responseText, status, userType, method]);
        }),
      );
  }
}
