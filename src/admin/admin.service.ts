import { HttpException, Injectable } from '@nestjs/common';
import { BistudentService } from 'src/bistudent/bistudent.service';
import { EndeService } from 'src/ende/ende.service';
import { FileService } from 'src/file/file.service';
import { QueryDbService } from 'src/query-db/query-db.service';
import { StudentService } from 'src/student/student.service';
import { TeacherService } from 'src/teacher/teacher.service';
import { UserService } from 'src/user/user.service';
import { getConfigs } from 'src/util/global.funtions';
import * as config from '../../config.json'

@Injectable()
export class AdminService {
  constructor(
    private readonly dbQuery: QueryDbService,
    private readonly studentService: StudentService,
    private readonly userService: UserService,
    private readonly bistudentService: BistudentService,
    private readonly teacherService: TeacherService
  ) {}

  async getAllAttendStudents(pageSize: number, offset: number, queries: {
    name,
    username
  }) {
    const { name, username } = queries;
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
        ?
        ?
      ORDER BY student.id
      LIMIT ?, ?
    `

    const queryResult = await this.dbQuery.queryDb(sql, [
      !!name ? `AND student.name like '%${name}%'` : '',
      !!username ? `AND user.username like '%${username}%'` : '',
      pageSize * offset,
      pageSize * 1
    ]);
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
      SELECT \`key\`, value, lastUpdate, lastUpdateAdmin,
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
      SELECT name, email, personal_page, research_area,
        user.id AS uid, user.username AS username
      FROM teacher LEFT JOIN user ON teacher.uid=user.id
      WHERE teacher.id=?;
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

  /**
   * 
   * @param id lecture.id
   * @param body 
   */
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

  /**
   * 
   * @param id lecture.id
   * @param sid student.id
   * @param pid position.id
   */
  async addRecordForStudent(id: number, sid: number, pid: number) {
    // need to check if there is a position of lecture
    const findSql = `
      SELECT lecture.start
      FROM lecture INNER JOIN lecture_position on lecture.id=lecture_position.lid
      WHERE lecture.id=? and lecture_position.pid=?;
    `;

    const findResult = await this.dbQuery.queryDb(findSql, [id, pid]);
    if(findResult.length === 0) {
      throw new HttpException({
        msg: '该Lecture不存在此地点'
      }, 406);
    }

    const start = findResult[0].start;

    // insert:
    const insertSql = `
      INSERT INTO record(time, sid, pid)
      VALUES(?, ?, ?);
    `;

    await this.dbQuery.queryDb(insertSql, [start, sid, pid]);

    return {
      msg: '操作已成功'
    };
  }

  /**
   * 
   * @param id record.id 
   */
  async deleteRecord(id: number) {
    const sql = `
      DELETE FROM record
      WHERE id=?;
    `;

    await this.dbQuery.queryDb(sql, [id]);
    return {
      msg: '操作已完成'
    };
  }

  async addOneStudent(body: {
    username: string,
    password: string,
    name: string,
    email: string,
    teacher: number,
    student_id: string,
  }) {
    const {username, password, name, email, teacher, student_id} = body;
    // test if username exists:
    const selectSql = `
      SELECT 1
      FROM user
      WHERE username=?;
    `;
    if(!username) {
      throw new HttpException({
        msg: '需要提供用户名'
      }, 406);
    }
    const select = await this.dbQuery.queryDb(selectSql, [username]);
    if(select.length === 0) {
      // create user:
      if(!password) {
        throw new HttpException({
          msg: '需要提供密码'
        }, 406);
      }
      const epassword = EndeService.encodeToDatabase(password);
      const insertUserSql = `
        INSERT INTO user(username, password)
        VALUES(?, ?);
      `;
      await this.dbQuery.queryDb(insertUserSql, [username, epassword]);
    }

    // reget the user.id:
    const selectIdSql = `
      SELECT id
      FROM user
      WHERE username=?;
    `;
    const uid = (await this.dbQuery.queryDb(selectIdSql, [username]))[0].id;
    // test if student with uid exists:
    const existsSql = `
      SELECT 1
      FROM student
      WHERE uid=?;
    `;
    const exists = await this.dbQuery.queryDb(existsSql, [uid]);
    if(exists.length > 0) {
      throw new HttpException({
        msg: '该学生已存在'
      }, 406);
    }

    const insertStudentSql = `
      INSERT INTO student(uid, name, sid, email)
      VALUES(?, ?, ?, ?);
    `;

    const sid = 
      ((await this.dbQuery.queryDb(insertStudentSql, [uid, name, student_id, email])) as any).insertId;
    

    // add teacher if needed:
    if(!!teacher) {
      try {
        const bindSql = `
          INSERT INTO student_teacher(sid, tid)
          VALUES(?, ?);
        `;
        await this.dbQuery.queryDb(bindSql, [sid, teacher]);
      } catch(err) {
        throw new HttpException({
          msg: '学生已创建, 但绑定老师失败',
          err,
        }, 406);
      }
    }

    return {
      msg: '操作成功'
    };
  }

  /**
   * 
   * @param id student.id
   */
  async deleteOneStudent(id: number) {
    const deleteSql = `
      DELETE FROM student
      WHERE id=?;
    `;
    await this.dbQuery.queryDb(deleteSql, [id]);

    return {
      msg: '操作成功'
    };
  }

  /**
   * 
   * @param id student.id
   * @param body 
   */
  async updateOneStudentInfo(id: number, body: {
    email: string,
    student_id: string,
    name: string
  }) {
    const {email, student_id, name} = body;
    const sql = `
      UPDATE student
      SET email=?, sid=?, name=?
      WHERE id=?;
    `;
    await this.dbQuery.queryDb(sql, [email, student_id, name, id]);
    return {
      msg: '操作已完成'
    };
  }

  async addOneTeacher(body: {
    username: string,
    password: string,
    name: string,
    email: string,
    personal_page: string,
    research_area: string,
  }) {

    const {username, password, name, email, personal_page, research_area}
      = body;

    if(!username) {
      throw new HttpException({
        msg: '需要提供用户名'
      }, 406);
    }

    // test if username exists:
    const selectSql = `
      SELECT 1
      FROM user
      WHERE username=?;
    `;

    const selectResult = await this.dbQuery.queryDb(selectSql, [username]);
    if(selectResult.length === 0) {
      if(!password) {
        throw new HttpException({
          msg: '需要提供密码'
        }, 406);
      }
      // create user:
      const createUserSql = `
        INSERT INTO user(username, password)
        VALUES(?, ?);
      `;
      const epassword = EndeService.encodeToDatabase(password);
      await this.dbQuery.queryDb(createUserSql, [username, epassword]);
    }

    // get uid
    const getUidSql = `
      SELECT id
      FROM user
      WHERE username=?;
    `;
    const uid = (await this.dbQuery.queryDb(getUidSql, [username]))[0].id;
    // test if teacher exists:
    const existsSql = `
      SELECT 1
      FROM teacher
      WHERE uid=?;
    `;
    const exists = await this.dbQuery.queryDb(existsSql, [uid]);
    if(exists.length > 0) {
      throw new HttpException({
        msg: '老师已存在'
      }, 406);
    }
    const insertSql = `
      INSERT INTO teacher(uid, name, email, personal_page, research_area)
      VALUES(?, ?, ?, ?, ?);
    `;
    await this.dbQuery.queryDb(insertSql, [uid, name, email, personal_page, research_area]);
    return {
      msg: '操作成功'
    };
  }

  /**
   * 
   * @param id teacher.id
   */
  async deleteOneTeacher(id: number) {
    const deleteSql = `
      DELETE FROM teacher
      WHERE id=?;
    `;
    await this.dbQuery.queryDb(deleteSql, [id]);
    return {
      msg: '操作成功'
    };
  }

  /**
   * 
   * @param id teacher.id
   * @param body 
   */
  async updateOneTeacher(id: number, body: {
    name: string,
    research_area: string,
    personal_page: string,
    email: string,
  }) {
    const updateSql = `
      UPDATE teacher
      SET name=?, research_area=?, personal_page=?, email=?
      WHERE id=?;
    `;

    const {name, research_area, personal_page, email} = body;

    await this.dbQuery.queryDb(updateSql, [name, research_area, personal_page, email, id]);

    return {
      msg: '操作成功'
    };
  }

  /**
   * 
   * @param sid student.id
   * @param tid teacher.id
   */
  async addOrChangeTeacherForStudent(sid: number, tid: number) {
    const sql = `
      INSERT INTO student_teacher(sid, tid)
      VALUES(?, ?)
      ON DUPLICATE KEY UPDATE tid=?;
    `;
    await this.dbQuery.queryDb(sql, [sid, tid, tid]);
    return {
      msg: '操作成功'
    };
  }

  async addStudents(body: {
    username: string,
    password: string,
    name: string,
    email: string,
    student_id: string,
    teacher_username: string
  }[]) {
    const errors = [];
    let newStudents = 0;

    const findTidSql = `
      SELECT teacher.id AS id
      FROM teacher INNER JOIN user
      WHERE user.username=?;
    `
    for(const index in body) {
      // query teacher.id
      const value = body[index];
      const tid = (await this.dbQuery.queryDb(findTidSql, [value.teacher_username]))[0]?.id;
      if(!tid) {
        errors.push({
          ...value,
          err: '不存在此老师'
        });
      } else {
        try {
          await this.addOneStudent({
            ...value,
            teacher: tid
          });

          newStudents += 1;
        } catch (err) {
          errors.push({
            ...value,
            err
          });
        }
      }
    }

    return {
      msg: '操作成功',
      affected: newStudents,
      errors
    };
  }

  /**
   * 
   * @param id user.id
   * @param password plaintext
   */
  async changePassword(id: number, password: string) {
    return await this.userService.changePasswordForUser(id, '', password);
  }

  /**
   * 
   * @param id student.id
   * @param password plaintext
   */
  async changePasswordForStudent(id: number, password: string) {
    const sql = `
      SELECT user.id AS id
      FROM student INNER JOIN user ON student.uid=user.id
      WHERE student.id=?;
    `;

    const uid = (await this.dbQuery.queryDb(sql, [id]))[0].id;
    if(!uid) {
      throw new HttpException({
        msg: '不存在此学生'
      }, 406);
    }

    return await this.userService.changePasswordForUser(uid, '', password);
  }

  /**
   * 
   * @param id teacher.id
   * @param password plaintext
   */
  async changePasswordForTeacher(id: number, password: string) {
    const sql = `
      SELECT user.id AS id
      FROM teacher INNER JOIN user ON teacher.uid=user.id
      WHERE teacher.id=?;
    `;

    const tid = (await this.dbQuery.queryDb(sql, [id]))[0].id;
    if(!tid) {
      throw new HttpException({
        msg: '不存在此学生'
      }, 406);
    }

    return await this.userService.changePasswordForUser(tid, '', password);
  }

// for bichoice:

  async getEnrols() {
    const sql = `
      SELECT *
      FROM enrol;
    `;

    return await this.dbQuery.queryDb(sql, []);
  }

  async addNewEnrols(description: string) {
    const sql = `
      INSERT INTO enrol(description)
      VALUES(?); 
    `;
    const result: any = await this.dbQuery.queryDb(sql, [description]);

    return {
      msg: '操作成功',
      id: result.insertId,
      description
    };
  }

  async changeEnrolDescription(eid: number, description: string) {
    const sql = `
      UPDATE enrol
      SET description=?
      WHERE id=?;
    `

    await this.dbQuery.queryDb(sql, [description, eid]);
    return {
      msg: '操作成功',
      eid,
      description
    };
  }

  async deleteEnrol(eid: number) {
    // 删除enrol将会:
    // 1. 级联删除所有degree
    // 2. 级联删除对应的学生
    // 不允许在开始双选后调用此接口

    const config = await getConfigs(["current_stage", "stage_count"]);
    const current_stage = config.current_stage.value;
    if(current_stage === -1) {
      const sql = `
        DELETE FROM enrol
        WHERE id=?;
      `;
      await this.dbQuery.queryDb(sql, [eid]);
      return {
        msg: '操作成功'
      };
    }

    throw new HttpException({
      msg: '双选已经开始, 无法删除Enrol'
    }, 406);
  }

  async getDegrees() {
    const sql = `
      SELECT degree.id AS degree_id, degree.description AS degree_description,
        enrol.id AS enrol_id, enrol.description AS enrol_description
      FROM degree
        JOIN enrol ON degree.enrol = enrol.id;
    `;

    return await this.dbQuery.queryDb(sql, []);
  }

  async addNewDegree(description: string, eid: number) {
    const insertSql = `
      INSERT INTO degree(enrol, description)
      VALUES(?, ?);
    `;

    const result: any = await this.dbQuery.queryDb(insertSql, [eid, description]);
    const insertId = result.insertId;

    const sql = `
      SELECT degree.id AS degree_id, degree.description AS degree_description,
        enrol.id AS enrol_id, enrol.description AS enrol_description
      FROM degree
        JOIN enrol ON degree.enrol = enrol.id
      WHERE degree.id=?;
    `;

    return (await this.dbQuery.queryDb(sql, [insertId]))[0];
  }

  async changeDegreeDescription(id: number, description: string) {
    const updateSql = `
      UPDATE degree
      SET description=?
      WHERE id=?;
    `;

    await this.dbQuery.queryDb(updateSql, [description, id]);

    const sql = `
      SELECT degree.id AS degree_id, degree.description AS degree_description,
        enrol.id AS enrol_id, enrol.description AS enrol_description
      FROM degree
        JOIN enrol ON degree.enrol = enrol.id
      WHERE degree.id=?;
    `;

    return (await this.dbQuery.queryDb(sql, [id]))[0];
  }

  async deleteDegree(id: number) {
    const config = await getConfigs(["current_stage", "stage_count"]);
    const current_stage = config.current_stage.value;
    if(current_stage === -1) {
      const deleteSql = `
        DELETE FROM degree
        WHERE id=?;
      `;
      await this.dbQuery.queryDb(deleteSql, [id]);
      return {
        msg: '删除成功'
      };
    }

    throw new HttpException({
      msg: '双选已经开始, 无法删除Degree'
    }, 406);
  }

  async getAllBistudents() {
    const sql = `
      SELECT *
      FROM bistudent;
    `;

    return await this.dbQuery.queryDb(sql, []);
  }

  async addNewBistudent(info) {

    const createUserSql = `
      INSERT INTO user(username, password)
      VALUES(?, ?)
      ON DUPLICATE KEY UPDATE password=?;
    `;
    info.password = EndeService.encodeToDatabase(info.password);
    await this.dbQuery.queryDb(createUserSql, [info.username, info.password, info.password])
    
    const selectUidSql = `
      SELECT id
      FROM user
      WHERE username=?;
    `;

    const uid = (await this.dbQuery.queryDb(selectUidSql, [info.username]))[0].id;

    const sql = `
      INSERT INTO bistudent(uid, name, recommended, score, graduation_university,
        graduation_major, household_register, ethnic, phone,
        gender, email, source, degree, image)
      VALUES(?,?,?,?,?,
        ?,?,?,?,
        ?,?,?,?,?)
      ON DUPLICATE KEY UPDATE name=?, recommended=?, score=?, graduation_university=?,
        graduation_major=?, household_register=?, ethnic=?, phone=?,
        gender=?, email=?, source=?, degree=?, image=?;
      
    `;

    const r: any = await this.dbQuery.queryDb(sql, [uid, info.name, info.recommended, info.score, info.graduation_university,
      info.graduation_major, info.household_register, info.ethnic, info.phone,
      info.gender, info.email, info.source, info.degree, config.defaultImage, info.name, info.recommended, info.score, info.graduation_university,
      info.graduation_major, info.household_register, info.ethnic, info.phone,
      info.gender, info.email, info.source, info.degree, config.defaultImage]);
    
    const insertId = r.insertId;
    return {
      msg: '新建成功',
      id: insertId
    };
  }

  async addNewBistudents(infos: any) {
    const error = [];
    let success = 0;
    for(const index in infos) {
      const info = infos[index];
      try {
        await this.addNewBistudent(info);
        success += 1;
      } catch(err) {
        error.push({
          ...info,
          err
        });
      }
    }

    return {
      msg: '操作已完成',
      success,
      error
    };
  }

  async changeBistudentInfo(id: number, info: any) {
    const sql = `
      UPDATE bistudent
      SET name=?, recommended=?, score=?, graduation_university=?,
        graduation_major=?, household_register=?, ethnic=?, phone=?,
        gender=?, email=?, source=?, degree=?
      WHERE id=?;
    `;
    await this.dbQuery.queryDb(sql, [
      info.name, info.recommended, info.score, info.graduation_university,
      info.graduation_major, info.household_register, info.ethnic, info.phone,
      info.gender, info.email, info.source, info.degree,
      id
    ]);

    const selectSql = `
      SELECT *
      FROM bistudent
      WHERE id=?;
    `

    return {
      msg: '修改成功',
      bistudent: await this.dbQuery.queryDb(selectSql, [id]),
    };
  }

  async deleteBistudent(id: number) {
    const config = await getConfigs(["current_stage", "stage_count"]);
    const current_stage = config.current_stage.value;
    if(current_stage === -1) {
      const selectUidSql = `
        SELECT uid
        FROM bistudent
        WHERE id=?;
      `;
      const uid = (await this.dbQuery.queryDb(selectUidSql, [id]))[0].uid;
      if(uid) {
        const deleteSql = `
          DELETE FROM user
          WHERE id=?
        `;

        await this.dbQuery.queryDb(deleteSql, [uid]);
        return {
          msg: '删除成功'
        };
      }

      throw new HttpException({
        msg: '删除失败, 没有找到对应的用户'
      }, 406);
    }
    throw new HttpException({
      msg: '双选已经开始, 无法删除用户'
    }, 406);
  }

  async getBistudentCanSelectTeachers(id: number) {
    return await this.bistudentService.getAllTeachers(id);
  }

  async getBistudentSelectedTeachers(id: number) {
    const student = await this.bistudentService.getInfo(id);
    const selected_teachers = student?.selected_teachers;
    if(selected_teachers) {
      return JSON.parse(selected_teachers);
    } else {
      throw new HttpException({
        msg: '无法找到此学生'
      }, 406);
    }
  }

  async selectTeacherForBistudent(bisid: number, tid: number) {
    return await this.bistudentService.selectOneTeacher(bisid, tid);
  }

  async deleteTeacherForBistudent(bisid: number, tid: number) {
    return await this.bistudentService.deleteOneTeacher(bisid, tid);
  }

  async getBistudentFileList(bisid: number) {
    return await this.bistudentService.getFileList(bisid);
  }

  async getBistudentFile(fid: number) {
    const sql = `
      SELECT port, ffid
      FROM file
      WHERE id=?;
    `;

    const query = (await this.dbQuery.queryDb(sql, [fid]))[0];
    if(!!query) {
      return await FileService.getFile(query.port, query.ffid);
    }

    throw new HttpException({
      msg: '不存在此文件'
    }, 404);
  }

  async deleteBistudentFile(fid: number) {
    const sql = `
      DELETE FROM file
      WHERE id=?;
    `;

    await this.dbQuery.queryDb(sql, [fid]);
    return {
      msg: '删除成功'
    };
  }
  
  async getSources() {
    const sql = `
      select * FROM source;
    `;
    return await this.dbQuery.queryDb(sql, []);
  }

  async addNewSource(body) {
    const sql = `
      INSERT INTO source(description)
      VALUES(?);
    `;

    const query: any = await this.dbQuery.queryDb(sql, [body.description]);
    const insertId = query.insertId;
    return {
      msg: '添加成功',
      id: insertId,
      description: body.description
    }
  }

  async changeSourceDescription(id: number, description: string) {
    const sql = `
      UPDATE source
      SET description=?
      WHERE id=?;
    `;

    await this.dbQuery.queryDb(sql, [description, id]);
    return {
      msg: '更新成功',
      id,
      description
    }
  }

  async deleteSource(id: number) {
    const sql = `
      DELETE FROM source
      WHERE id=?;
    `;

    await this.dbQuery.queryDb(sql, [id]);
    return {
      msg: '删除成功',
      id
    }
  }

  async getAllBiTeachers() {
    const sql = `
      SELECT id, name, email, personal_page, research_area,
        bichoice_config, selected_students
      FROM teacher;
    `;

    return await this.dbQuery.queryDb(sql, []);
  }

  async getOneBiTeacher(id: number) {
    const sql = `
      SELECT id, name, email, personal_page, research_area,
        bichoice_config, selected_students
      FROM teacher
      WHERE id=?;
    `;

    return await this.dbQuery.queryDb(sql, [id]);
  }

  async getStudentsOfTeachers(id: number) {
    return await this.teacherService.getBistudents(id);
  }

  async getTeacherEnrols(id: number) {
    return await this.teacherService.getMyEnrols(id);
  }

  async getTeacherDegrees(id: number) {
    return await this.teacherService.getMyDegrees(id);
  }
}
