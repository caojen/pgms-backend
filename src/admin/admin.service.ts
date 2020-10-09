import { Injectable } from '@nestjs/common';
import { QueryDbService } from 'src/query-db/query-db.service';
import { StudentService } from 'src/student/student.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly dbQuery: QueryDbService,
    private readonly studentService: StudentService,
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

    const queryResult = await this.dbQuery.queryDb(sql, [pageSize * offset, pageSize * 1]);
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

  /**
   * 
   * @param id student.id
   */
  async getStudentInfo(id: number) {
    const sql = `
      SELECT student.id AS sid, student.name AS sname, student.email AS semail, student.sid AS student_id,
        teacher.id AS tid, teacher.name AS tname, teacher.email AS temail,
        teacher.personal_page AS personal_page, teacher.research_area AS research_area
      FROM student
        LEFT JOIN student_teacher ON student.id=student_teacher.sid
        LEFT JOIN teacher ON student_teacher.tid=teacher.id
      WHERE student.id=?;
    `;
    const result = (await this.dbQuery.queryDb(sql, [id]))[0];
    return {
      id: result.sid,
      name: result.sname,
      email: result.semail,
      student_id: result.student_id,
      teacher: {
        id: result.tid,
        name: result.tname,
        temail: result.temail,
        personal_page: result.personal_page,
        research_area: result.research_area
      }
    };
  }


  /**
   * 
   * @param id student.id
   * @param pageSize 
   * @param offset 
   */
  async getStudentRecords(id: number, pageSize: number, offset: number) {
    return this.studentService.getRecords(id, pageSize, offset);
  }

  /**
   * get all settings from table setting
   */
  async getSettings() {
    const sql = `
      SELECT 'key', value, lastUpdate, lastUpdateAdmin,
        name, type
      FROM settings LEFT JOIN admin ON settings.lastUpdateAdmin=admin.id;
    `;

    const query = await this.dbQuery.queryDb(sql, []);
    return query.map(result => {
      return {
        key: result.key,
        value: result.value,
        lastUpdateTime: result.lastUpdate,
        lastUpdateAdmin: {
          name: result.name,
          type: result.type
        }
      }
    });
  }

  /**
   * 
   * @param id admin.id
   * @param key 
   * @param value 
   */
  async updateOrInsertSetting(id: number, key: string, value: string | number) {
    const sql = `
      INSERT INTO settings('key', value, lastUpdateAdmin)
      VALUES(?, ?, ?)
      ON DUPLICATE KEY UPDATE value=?;
    `;

    await this.dbQuery.queryDb(sql, [key, value, id, value]);

    return {
      msg: '操作成功'
    };
  }
}
