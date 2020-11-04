//! 全局拦截器
//! 记录了能够正常通过权限访问的请求
//! 正常访问下, 将不会记录response的body

import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as database from '../../database.json';
import * as mysql from 'mysql2/promise';

const config = database.test;

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  private readonly logger = new Logger("Interceptor");
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

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request["user"];
    const uid = user ? user.uid : null;
    const ip = request.socket.remoteAddress;
    const method = request.method;
    const url = request.url;
    const responseText = '';
    const status = 200;
    const userType = this.getUserType(user);

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