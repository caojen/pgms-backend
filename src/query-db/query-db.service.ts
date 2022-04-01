import { HttpException, Injectable, Logger } from '@nestjs/common';
import * as global from '../../config.json';
import * as mysql from 'mysql2/promise';
import { exit } from 'process';

@Injectable()
export class QueryDbService {
  constructor() {
    if (!process.env["MYSQL_HOST"]) {
      console.log("你似乎还没有指定MYSQL相关配置");
      exit(1);
    }

    this.selectedPool = mysql.createPool({
      host: process.env["MYSQL_HOST"],
      port: parseInt(process.env["MYSQL_PORT"]),
      user: process.env["MYSQL_USER"],
      database: process.env["MYSQL_DATABASE"],
      password: process.env["MYSQL_PASSWORD"],
      multipleStatements: false,
      connectionLimit: 20,
      waitForConnections: true,
      queueLimit: 0
    });

    this.executePool = mysql.createPool({
      host: process.env["MYSQL_HOST"],
      port: parseInt(process.env["MYSQL_PORT"]),
      user: process.env["MYSQL_USER"],
      database: process.env["MYSQL_DATABASE"],
      password: process.env["MYSQL_PASSWORD"],
      multipleStatements: false,
      connectionLimit: 20,
      waitForConnections: true,
      queueLimit: 0
    });
  }

  private logger: Logger = new Logger(QueryDbService.name);
  private selectedPool: mysql.Pool = null;
  private executePool: mysql.Pool = null;

  async queryDb(sql: string, params: any[]) {
    try {
      if(sql.trim().substr(0, 6).toLocaleLowerCase() === 'select') {
        const res = await this.selectedPool.query(sql, params)
        return res[0] as any
      } else {
        return (await this.executePool.query(sql, params))[0] as any[];
      }
    } catch(err) {
      this.logger.log(err);
      throw new HttpException("数据库查询出错", 500);
    }
  }
}
