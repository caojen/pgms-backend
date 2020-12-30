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

  /**
   * Get records of student. If one record matches one lecture, return the lecture meanwhile, else, return default.
   * 
   * @param id student.sid
   * @param pageSize the page size of presented form
   * @param offset number of the current page
   */
  async getRecords(id: number, pageSize: number, offset: number) {
    const begin = pageSize * offset;
    const countSql = `
      SELECT count(1) AS total
      FROM record
      WHERE sid=?;
    `;
    const total = (await this.dbQuery.queryDb(countSql, [id]))[0].total;
    
    const selectRecordSql = `
      SELECT record.id AS id, record.time AS rtime, position.description AS position, position.id AS pid
      FROM record LEFT JOIN position on record.pid=position.id
      WHERE record.sid=?
      ORDER BY record.time DESC
      Limit ?, ?;
    `;

    const queryRecord = await this.dbQuery.queryDb(selectRecordSql, [id, begin, pageSize*1]);

    const selectedLectureSql = `
      SELECT lecture.title AS title, lecture.content AS content, lecture.start AS start, lecture.end AS end
      FROM lecture INNER JOIN lecture_position ON lecture.id=lecture_position.lid
      WHERE lecture.start <= ?
        AND lecture.end >= ?
        AND lecture_position.pid = ?;
    `;

    for(const index in queryRecord) {
      const record = queryRecord[index];

      const queryLecture = await this.dbQuery.queryDb(selectedLectureSql, [record.rtime, record.rtime, record.pid]);
      if(queryLecture.length > 0) {
        // note: only one lecture can appear at one position at one time
        const lecture = queryLecture[0];
        queryRecord[index].detail = {
          title: lecture.title,
          content: lecture.content,
          start: lecture.start,
          end: lecture.end,
        };
      }
    }
    
    return {
      total,
      records: queryRecord.map(query => {
        return {
          id: query.id,
          rtime: query.rtime,
          position: query.position,
          detail: query.detail || { title: '日常考勤' },
        };
      }),
    };
  }

  async getLectures(pageSize: number, offset: number) {
    const countSql = `
      SELECT count(1) AS count
      FROM lecture;
    `;

    const querySql = `
      SELECT id, title, content, start, end
      FROM lecture
      ORDER BY id desc
      LIMIT ?, ?;
    `;

    const count = (await this.dbQuery.queryDb(countSql, []))[0].count;
    const lectures = await this.dbQuery.queryDb(querySql, [pageSize * offset, pageSize * 1]);

    const positionSql = `
      SELECT position.description AS description, position.device AS device, position.id AS pid
      FROM lecture
        INNER JOIN lecture_position ON lecture.id = lecture_position.lid
        INNER JOIN position ON position.id = lecture_position.pid
      WHERE lecture.id=?;
    `;

    for(const index in lectures) {
      const lecture = lectures[index];
      const positions = await this.dbQuery.queryDb(positionSql, [lecture.id]);
      lecture.positions = positions.map(position => {
        return {
          id: position.pid,
          description: position.description,
          device: position.device,
        };
      });
    }

    return {
      count,
      lectures
    }
  }
}
