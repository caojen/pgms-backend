import { Injectable, Logger } from '@nestjs/common';
import { Cron, NestSchedule } from 'nest-schedule';
import { QueryDbService } from 'src/query-db/query-db.service';
import * as strftime from 'strftime';
import * as requestAsync from 'request-promise-native';

@Injectable()
export class AutoscriptService extends NestSchedule {
  constructor(
    private readonly dbQuery: QueryDbService
  ) {
    super()
  }

  // private readonly logger = new Logger(AutoscriptService.name);

  // @Cron('*/10 * * * *')
  // async fetchRecords() {
  //   const current = new Date(Date.now());

  //   // query from database, and get the last date
  //   const recordSql = `
  //     SELECT time
  //     FROM record
  //     ORDER BY time DESC
  //     LIMIT 1;
  //   `;

  //   const record = await this.dbQuery.queryDb(recordSql, []);

  //   // TODO: send get and save the records
  //   let lastDate: Date;
  //   if(record.length === 0) {
  //     // no record here, set to default
  //     lastDate = new Date(Date.parse('2010-01-01 00:00:00'));
  //   } else {
  //     lastDate = record[0].time;
  //   }
  //   // lastDate = new Date(Date.parse('2020-01-01 00:00:00'));
  //   const startTime = strftime('%F%%20%T', lastDate);
  //   const endTime = strftime('%F%%20%T', current);
  //   const response = JSON.parse(await requestAsync(`http://222.200.182.31:8088/api/transaction/getAttTransactions?startTime=${startTime}&endTime=${endTime}&access_token=123456`, {
  //     headers: {
  //       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.87 Safari/537.36'
  //     }
  //   }));

  //   if(response.code !== 0) {
  //     this.logger.log('无法获取考勤信息');
  //   } else {
  //     const data = response.data;
  //     let affectedRows = 0;
  //     for(const index in data) {
  //       const value = data[index];
  //       const id = value.id;
  //       const username = value.personPin;
  //       const device = value.deviceSn;
  //       const date = new Date(value.attDatetime);
  //       // check if username as student is exists:
  //       const checkUsernameSql = `
  //         SELECT student.id AS id
  //         FROM student JOIN user on user.id = student.uid
  //         WHERE user.username=?;
  //       `;
  //       const usernameResult = await this.dbQuery.queryDb(checkUsernameSql, [username]);
  //       if(usernameResult.length > 0) {
  //         const sid = usernameResult[0].id;
  //         // check if device exists:
  //         const checkPositionSql = `
  //           SELECT id
  //           FROM position
  //           WHERE device=?;
  //         `;
  //         const positionResult = await this.dbQuery.queryDb(checkPositionSql, [device]);
  //         if(positionResult.length > 0) {
  //           const pid = positionResult[0].id;
  //           // check if originId exists:
  //           const checkOriginIdSql = `
  //             SELECT id
  //             FROM record
  //             WHERE originId=?;
  //           `;
  //           const originIdResult = await this.dbQuery.queryDb(checkOriginIdSql, [id]);
  //           if(originIdResult.length === 0) {
  //             // insert into database
  //             const insertSql = `
  //               INSERT INTO record(time, sid, pid, originId)
  //               values(?, ?, ?, ?);
  //             `;
  //             await this.dbQuery.queryDb(insertSql, [date, sid, pid, id]);
  //             affectedRows += 1;
  //           }
  //         }
  //       }
  //     }

  //     this.logger.log(`auto affected rows: ${affectedRows}/${data.length}, ${startTime}, ${endTime}`)
  //   }

  // }
}
