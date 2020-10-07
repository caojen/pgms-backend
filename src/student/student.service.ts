import { Injectable } from '@nestjs/common';
import { QueryDbService } from 'src/query-db/query-db.service';

@Injectable()
export class StudentService {

  constructor(
    private readonly dbQuery: QueryDbService
  ) {}

  /**
   * 
   * @param id student.id
   */
  async getTeacherOfStudent(id: number) {
    const sql = `
      SELECT teacher.name, teacher.email, teacher.personal_page, teacher.research_area
      FROM teacher JOIN student_teacher on teacher.id = student_teacher.tid
      WHERE student_teacher.sid=?;
    `;

    const query = await this.dbQuery.queryDb(sql, [id]);
    if(query.length === 0) {
      return {};
    } else {
      return query[0];
    }
  }

  /**
   * 
   * @param id student.id
   * @param email new student.email
   */
  async changeEmailForStudent(id: number, email: string) {
    const sql = `
      UPDATE student
      SET email=?
      WHERE id=?;
    `;

    await this.dbQuery.queryDb(sql, [email, id]);
  }

}
