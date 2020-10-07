import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { QueryDbService } from 'src/query-db/query-db.service';


@Injectable()
export class AutoscriptService {
  constructor(
    private readonly dbQuery: QueryDbService
  ) {}

  private readonly logger = new Logger(AutoscriptService.name);

  // @Cron('*/1 * * * * *')
  async fetchRecords() {
    const current = new Date(Date.now());
    
    // query from database, and get the last date
    const recordSql = `
      SELECT time
      FROM record
      ORDER BY time DESC
      LIMIT 1;
    `;

    const record = await this.dbQuery.queryDb(recordSql, []);
    this.logger.log(record);

    // TODO: send get and save the records
  }
}
