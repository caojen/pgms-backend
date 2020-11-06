import { Injectable } from '@nestjs/common';
import { QueryDbService } from 'src/query-db/query-db.service';

@Injectable()
export class BistudentService {

  constructor(
    private readonly dbQuery: QueryDbService
  ) {}

  async updateInfo(id, {phone, email}) {
    const sql = `
      UPDATE bistudent
      SET phone = ?, email = ?
      WHERE id = ?;
    `;

    await this.dbQuery.queryDb(sql, [phone, email, id]);
    return {
      msg: '修改信息成功'
    };
  }
}
