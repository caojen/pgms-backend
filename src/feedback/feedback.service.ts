import { HttpException, Injectable } from '@nestjs/common';
import { QueryDbService } from 'src/query-db/query-db.service';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly dbQuery: QueryDbService
  ) {}

  async forgetPassword(identify: string, body: Object) {
    try {
      const strBody = JSON.stringify(body);
      if(!strBody) {
        throw new HttpException({
          msg: '无效的数据',
        }, 406);
      }
      const sql = `
        INSERT INTO feedback(idenfity, type, detail)
        VALUES (?, 'forget-password', ?);
      `;
      await this.dbQuery.queryDb(sql, [identify, strBody]);
      return {
        msg: '创建成功'
      };
    } catch (e) {
      console.log(e)
      if(e.msg) {
        throw e
      } else {
        throw new HttpException({
          response: e,
          msg: '无效的数据'
        }, 406)
      }
    }
  }
}
