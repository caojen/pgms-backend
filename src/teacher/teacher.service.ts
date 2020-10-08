import { HttpException, Injectable } from '@nestjs/common';
import { off } from 'process';
import { QueryDbService } from 'src/query-db/query-db.service';
import { StudentService } from 'src/student/student.service';

@Injectable()
export class TeacherService {

  constructor(
    private readonly dbQuery: QueryDbService,
    private readonly studentService: StudentService
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

  /**
   * @permission student should be one of teacher's students
   * @param id teacher.id
   * @param sid student.id
   */
  async getAllRecordsOfOneStudent(id: number, sid: number, pageSize: number, offset: number) {
    // to test if teacher has this student
    
    const hasStudentSql = `
      SELECT 1
      FROM teacher INNER JOIN student_teacher ON teacher.id=student_teacher.tid
      WHERE teacher.id=? AND student_teacher.sid=?;
    `

    const result = await this.dbQuery.queryDb(hasStudentSql, [id, sid]);
    if(result.length > 0) {
      // call student's getRecords:
      return await this.studentService.getRecords(sid, pageSize, offset);
    }

    throw new HttpException({
      msg: '该老师没有这个学生'
    }, 406);
  }
}
