import { Injectable } from '@nestjs/common';
import { QueryDbService } from 'src/query-db/query-db.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly dbQuery: QueryDbService
  ) {}

  async getAllAttendStudents(pageSize: number, offset: number) {
    const countSql = `
      SELECT count(1) AS count
      FROM student LEFT JOIN user on student.uid=user.id
      WHERE user.isActive=1;
    `

    const count = (await this.dbQuery.queryDb(countSql, []))[0].count;

    const sql = `
      SELECT student.id AS sid, student.name AS name,
        student.sid AS student_id, student.email AS email,
        user.id AS uid, user.username AS username
      FROM student LEFT JOIN user on student.uid=user.id
      WHERE user.isActive=1
      ORDER BY student.id
      LIMIT ?, ?
    `

    const queryResult = await this.dbQuery.queryDb(sql, [pageSize * offset, pageSize]);
    return {
      count,
      students: queryResult.map(result => {
        return {
          id: result.sid,
          name: result.name,
          student_id: result.student_id,
          email: result.email,
          user: {
            id: result.uid,
            username: result.username
          }
        };
      })
    }
  }
}
