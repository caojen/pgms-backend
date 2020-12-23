import { HttpException, Injectable, Logger } from '@nestjs/common';
import * as database from '../../database.json';
import * as global from '../../config.json';
import * as mysql from 'mysql2/promise';

@Injectable()
export class QueryDbService {
  private readonly config = database[global.env]
  constructor() {
    this.selectedPool = mysql.createPool({
      host: this.config.host,
      user: this.config.user,
      database: this.config.database,
      password: this.config.password,
      multipleStatements: false,
      connectionLimit: 20,
      waitForConnections: true,
      queueLimit: 0
    });

    this.executePool = mysql.createPool({
      host: this.config.host,
      user: this.config.user,
      database: this.config.database,
      password: this.config.password,
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
        return (await this.selectedPool.query(sql, params))[0] as any[];
      } else {
        return (await this.executePool.query(sql, params))[0] as any[];
      }
    } catch(err) {
      this.logger.log(err);
      throw new HttpException("数据库查询出错", 500);
    }
  }

}
