import { Injectable } from '@nestjs/common';
import { QueryDbService } from 'src/query-db/query-db.service';

@Injectable()
export class TeacherService {

  constructor(
    private readonly dbQuery: QueryDbService
  ) {}

  /**
   * 
   * @param id teacher.id
   */
  async getAllStudentsOfTeacher(id: number) {
    const sql = `
      SELECT student.id AS id, student.name AS name, student.email AS email
      FROM teacher
        INNER JOIN student_teacher ON teacher.id=student_teacher.tid
        INNER JOIN student ON student_teacher.sid=student.id
      WHERE teacher.id=?;
    `;
    const students = await this.dbQuery.queryDb(sql, [id]);
    const selectRecordSql = `
      SELECT record.time
      FROM record INNER JOIN student ON record.sid=student.id
      WHERE student.id=?;
    `;

    // get the latest record's time of all students
    for(const index in students) {
      const value = students[index];
      const record = await this.dbQuery.queryDb(selectRecordSql, [value.id]);
      students[index].latestRecordTime = record[0]?.time || null;
    }

    return students.map(student => {
      return {
        id: student.id,
        name: student.name,
        email: student.email,
        latestRecordTime: student.latestRecordTime
      };
    });
  }
}
