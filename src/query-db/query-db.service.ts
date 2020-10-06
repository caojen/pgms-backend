import { HttpException, Injectable } from '@nestjs/common';
import * as database from '../../database.json';
import * as mysql from 'mysql2/promise';

@Injectable()
export class QueryDbService {

  constructor() {
    const config = database.test;
    this.selectedPool = mysql.createPool({
      host: config.host,
      user: config.user,
      database: config.database,
      password: config.password,
      connectionLimit: 20,
      waitForConnections: true,
      queueLimit: 0
    });

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

  private selectedPool: mysql.Pool = null;
  private executePool: mysql.Pool = null;

  async queryDb(sql: string, params: any[]) {
    try {
      if(sql.trim().substr(0, 6).toLocaleLowerCase() === 'select') {
        return (await this.selectedPool.query(sql, params))[0];
      } else {
        return (await this.executePool.query(sql, params))[0];
      }
    } catch(err) {
      console.log(err);
      throw new HttpException("数据库查询出错", 500);
    }
  }

}
