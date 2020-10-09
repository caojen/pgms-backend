import { HttpException, Injectable } from '@nestjs/common';
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
   * @param value a json formatted like: {value: 15}
   */
  async updateOrInsertSetting(id: number, key: string, value: string) {
    const sql = `
      INSERT INTO settings(\`key\`, value, lastUpdateAdmin)
      VALUES(?, ?, ?)
      ON DUPLICATE KEY UPDATE value=?, lastUpdateAdmin=?;
    `;

    await this.dbQuery.queryDb(sql, [key, value, id, value, id]);

    return {
      msg: '操作成功'
    };
  }

  /**
   * 
   * @param pageSize 
   * @param offset 
   */
  async getAllTeachers(pageSize: number, offset: number) {
    const sql = `
      SELECT id, name, email, personal_page, research_area
      FROM teacher
      ORDER BY id
      LIMIT ?, ?;
    `;

    const query = await this.dbQuery.queryDb(sql, [pageSize*offset, pageSize*1]);
    const countSql = `
      SELECT count(1) AS count
      FROM teacher;
    `;
    const count = (await this.dbQuery.queryDb(countSql, []))[0].count;
    return {
      count,
      teachers: query
    };
  }

  /**
   * 
   * @param id teacher.id
   */
  async getOneTeacherInfo(id: number) {
    const sql = `
      SELECT name, email, personal_page, research_area
      FROM teacher
      WHERE id=?;
    `;

    const queryStudentsSql = `
      SELECT student.id AS sid, student.name AS name, student.sid AS student_id, student.email AS email
      FROM student_teacher LEFT JOIN student ON student_teacher.sid=student.id
      WHERE tid=?;
    `

    const basic = (await this.dbQuery.queryDb(sql, [id]))[0];
    const students = await this.dbQuery.queryDb(queryStudentsSql, [id]);
    return {
      ...basic,
      students: students.map(student => {
        return {
          id: student.sid,
          name: student.name,
          student_id: student.student_id,
          email: student.email
        };
      }),
    };
  }

  /**
   * 
   * @param pageSize 
   * @param offset 
   */
  async getAllLectures(pageSize: number, offset: number) {
    const countSql = `
      SELECT count(1) AS count
      FROM lecture;
    `;

    const querySql = `
      SELECT id, title, content, start, end
      FROM lecture
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

  /**
   * return all positions
   */
  async getAllPositions() {
    const sql = `
      SELECT *
      FROM position;
    `;

    return await this.dbQuery.queryDb(sql, []);
  }

  /**
   * 
   * @param id position.id
   * @param description 
   * @param device 
   */
  async changeOnePosition(id: number, description: string, device: string) {
    const sql = `
      UPDATE position
      SET description=?, device=?
      WHERE id=?;
    `;

    await this.dbQuery.queryDb(sql, [description, device, id]);

    return {
      msg: '操作成功'
    };
  }

  /**
   * 
   * @param description 
   * @param device 
   */
  async insertOnePosition(description: string, device: string) {
    const sql = `
      INSERT INTO \`position\` (description, device)
      VALUES (?, ?);
    `;

    try {
      await this.dbQuery.queryDb(sql, [description, device]);

      return {
        msg: '创建成功'
      }

    } catch (err) {
      throw new HttpException({
        msg: '创建失败',
        err
      }, 406);
    }
  }

  /**
   * 
   * @param id position.id
   */
  async deleteOnePosition(id: number) {
    const sql = `
      DELETE FROM \`position\`
      WHERE id=?;
    `;

    await this.dbQuery.queryDb(sql, [id]);
    return {
      msg: '操作已完成'
    }
  }

  /**
   * 
   * @param body 
   */
  async addOneLecture(body: {
    title: string,
    content: string,
    positions: number[],
    start: Date,
    end: Date
  }) {
    const insertSql = `
      INSERT INTO lecture(title, content, start, end)
      VALUES(?, ?, ?, ?);
    `;

    const insertId = ((await this.dbQuery.queryDb(insertSql, [
      body.title,
      body.content,
      body.start,
      body.end
    ])) as any).insertId;

    const insertPositionSql = `
      INSERT INTO lecture_position(lid, pid)
      VALUES(?, ?);
    `;

    for(const value of body.positions) {
      try {
        await this.dbQuery.queryDb(insertPositionSql, [insertId, value])
      } catch(err) {
        // ignore error here...
      }
    }

    return {
      msg: '操作已完成'
    };
  }

  /**
   * 
   * @param id lecture.id
   */
  async deleteOneLecture(id: number) {
    const sql = `
      DELETE FROM lecture
      WHERE id=?;
    `;

    await this.dbQuery.queryDb(sql, [id]);

    return {
      msg: '操作已完成'
    };
  }

  async updateOneLecture(id: number, body: {
    title: string,
    content: string,
    positions: number[],
    start: Date,
    end: Date
  }) {
    // update itself
    const updateSql = `
      UPDATE lecture
      SET title=?, content=?, start=?, end=?
      WHERE id=?;
    `;

    await this.dbQuery.queryDb(updateSql, [
      body.title,
      body.content,
      body.start,
      body.end,
      id
    ]);

    // delete all old positions:
    const deleteSql = `
      DELETE FROM lecture_position
      WHERE lid=?;
    `;

    await this.dbQuery.queryDb(deleteSql, [id]);

    // insert:
    const insertPositionSql = `
      INSERT INTO lecture_position(lid, pid)
      VALUES(?, ?);
    `;
    for(const value of body.positions) {
      try {
        await this.dbQuery.queryDb(insertPositionSql, [id, value])
      } catch(err) {
        // ignore error here...
      }
    }

    return {
      msg: '操作已完成'
    };
  }
}
