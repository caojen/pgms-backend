import { HttpException, Injectable } from '@nestjs/common';
import { BistudentService } from 'src/bistudent/bistudent.service';
import { FileService } from 'src/file/file.service';
import { QueryDbService } from 'src/query-db/query-db.service';
import { StudentService } from 'src/student/student.service';

@Injectable()
export class TeacherService {

  constructor(
    private readonly dbQuery: QueryDbService,
    private readonly studentService: StudentService,
    private readonly bistudentService: BistudentService
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
  
  /**
   * 
   * @param id teacher.id
   * @param \{email, personal_page, research_area\}
   */
  async updateTeacherInfo(id: number, {email, personal_page, research_area}) {
    const sql = `
      UPDATE teacher
      SET teacher.email=?, personal_page=?, research_area=?
      WHERE teacher.id=?;
    `;

    await this.dbQuery.queryDb(sql, [email, personal_page, research_area, id]);

    return {
      msg: '操作成功'
    };
  }

  async getBiChoiceInfo() {
    /**
      stage_count: number; 表示双选时总共的阶段数(这也是学生可以选择的老师总数)
      current_stage: number; 表示当前的阶段数. 当值为-1时代表未开始, 当值为0是代表学生选择阶段(1,2,3...等代表老师选择阶段) 当值大于stage_count时代表已结束
      begin_time: string; 一个可以格式化为date的字符串, 代表当前阶段开始时间
      end_time: string; 一个可以格式化为date的字符串, 代表当前阶段的结束时间 // 当当前时间位于两个时间之间时, 代表某个身份可以选择
     */
    const sql = `
      SELECT \`key\`, \`value\`
      FROM settings;
    `;

    const settings = await this.dbQuery.queryDb(sql, []);
    const returns = ["stage_count", "current_stage", "begin_time", "end_time"];
    const res = {};
    for(const index in settings) {
      const setting = settings[index];
      if(returns.indexOf(setting.key) !== -1) {
        res[setting.key] = setting.value;
      }
    }

    return res as any;
  }

  async getBistudents(_id: number) {
    const id = parseInt(_id as any);
    if(isNaN(id)) {
      throw new HttpException({ msg: '参数错误' }, 406);
    }

    // 获取双选情况
    const bichoiceInfo = await this.getBiChoiceInfo();
    const current_stage = JSON.parse(bichoiceInfo.current_stage).value;
    const stage_count = JSON.parse(bichoiceInfo.stage_count).value;
    if (current_stage <= 0) { return []; } // 老师还没开始时，不允许查看

    // 查看老师的bichoice_config
    const biconfigSql = `
      SELECT bichoice_config, selected_students
      FROM teacher WHERE id=?;
    `;

    const teacher = (await this.dbQuery.queryDb(biconfigSql, [id]))[0];

    const bichoice_config = JSON.parse(teacher.bichoice_config);
    const enrols = {}   // 从bichoice_config计算老师现在可用的enrol和degree
    const degrees = {}

    for (let i = 0; i < bichoice_config?.enrols?.length || 0; i++) {
      const eid = bichoice_config.enrols[i].id;
      const num = bichoice_config.enrols[i].num;
      if (num > 0) {
        enrols[eid] = bichoice_config.enrols[i].num;
      }
    }
    for (let i = 0; i < bichoice_config?.degrees?.length || 0; i++) {
      const did = bichoice_config.degrees[i].id;
      const num = bichoice_config.degrees[i].num;
      if (num > 0) {
        degrees[did] = bichoice_config.degrees[i].num;
      }
    }

    const res = []

    // 查看老师已选择的学生:
    const selected_students = JSON.parse(teacher.selected_students);
    // 对于之前选择阶段的学生，减去enrols和degrees, 并且将学生加入到res中
    for (let stage = 0; stage < current_stage - 1; stage++) {
      if (res[stage] === undefined) {
        res[stage] = [];
      }
      const students = selected_students[stage] || [];
      for (const index in students) {
        const student_id = students[index];
        const info = await this.bistudentService.getInfo(student_id);
        enrols[info.enrol_id]--;
        degrees[info.degree_id]--;
        res[stage].push({ ...info, selected: true, canSelect: false });
      }
    }

    // 对于当前阶段的学生，统计enrols和degrees，但不减去:
    const current_enrols = {};
    const current_degrees = {};
    const current_stage_students = selected_students[current_stage - 1] || [];
    for (const index in current_stage_students) {
      const student_id = current_stage_students[index];
      const info = await this.bistudentService.getInfo(student_id);
      info.enrol_id in current_enrols ? current_enrols[info.enrol_id] ++ : current_enrols[info.enrol_id] = 1;
      info.degree_id in current_degrees ? current_degrees[info.degree_id] ++ : current_degrees[info.degree_id] = 1;
    }

    // 判断当前还可以选择的学生的enrol和degree：
    const active_enrols = Object.keys(enrols).map(key => {
      if (enrols[key] > 0) {
        return parseInt(key);
      } else {
        return -1;
      }
    }).filter(f => f !== -1);

    const active_degrees = Object.keys(degrees).map(key => {
      if (degrees[key] > 0) {
        return parseInt(key);
      } else {
        return -1;
      }
    }).filter(f => f !== -1);

    // 选出这些学生，然后判断
    // 1. 这些学生是否被选择了, 如果被选择了，那么是不是这个老师选择的
    // 2. 这些学生是否有在本阶段和接下来的阶段选了这个老师
    // 3. 如果满足，那么添加到res中

    const studentsSql = `
      SELECT bistudent.id as id, name, recommended, score, graduation_university, graduation_major, household_register,
        ethnic, phone, gender, email, source.description as source, image, selected_teachers,
        enrol.id as enrol_id, user.username as username, enrol.description as enrol,
        degree.id as degree_id, degree.description as degree
      FROM bistudent
        LEFT JOIN user on user.id=bistudent.uid
        LEFT JOIN degree on degree.id=bistudent.degree
        LEFT JOIN enrol on enrol.id=degree.enrol
        LEFT JOIN source on bistudent.source=source.id
      WHERE ${active_enrols.length === 0 ? '0' : 'enrol.id in (?)'}
        AND ${active_degrees.length === 0 ? '0' : 'degree.id in (?)'}
      ORDER BY id;
    `;
    const arr = [];
    if (active_enrols.length > 0) { arr.push(active_enrols); }
    if (active_degrees.length > 0) { arr.push(active_degrees); }
    const students = await this.dbQuery.queryDb(studentsSql, arr);
    for (const index in students) {
      const student = students[index];
      student.selected_teachers = JSON.parse(student.selected_teachers);
      for (let stage = current_stage - 1; stage < stage_count; stage++) {
        if(res[stage] === undefined) { res[stage] = []; }

        if (student.selected_teachers[stage] === id) {
          if (await this.bistudentIsSelected(student.id) === false) {
            // 该学生选择了老师，并且还没有被选择
            const canSelect = stage === current_stage - 1 &&  // 在本阶段才可以选择
              enrols[student.enrol_id] > (current_enrols[student.enrol_id] || 0) &&
              degrees[student.degree_id] > (current_degrees[student.degree_id] || 0) // 老师人数还没有选满
            res[stage].push({
              ...student,
              selected: false,
              canSelect
            });
          } else {
            // 判断这个学生是不是被当前老师选择的
            if(!!selected_students[current_stage - 1]
              && selected_students[current_stage - 1].indexOf(student.id) !== -1) {
                // 是被当前老师选择的
                res[current_stage-1].push({
                  ...student,
                  selected: true,
                  canSelect: true
                });
            }
          }
        }
      }
    }
    console.log(res)
    return res;
  }

  async bistudentIsSelected(bisid: number): Promise<boolean> {
    const sql = `
      SELECT selected_teachers
      FROM bistudent
      WHERE id=?;
    `;
    const selected_teachers = JSON.parse((await this.dbQuery.queryDb(sql, [bisid]))[0].selected_teachers);
    const teacherSelectedSql = `
      SELECT selected_students
      FROM teacher
      WHERE id=?;
    `;

    for(const index in selected_teachers) {
      const teacher = selected_teachers[index];
      const selected_students = JSON.parse((await this.dbQuery.queryDb(teacherSelectedSql, [teacher]))[0].selected_students);
      for(const index in selected_students) {
        const students = selected_students[index];
        if(students && students.indexOf(bisid) !== -1) {
          return true;
        }
      }
    }

    return false;
  }

  async getSelectedBistudents(id: number) {
    const sql = `
      SELECT selected_students
      FROM teacher
      WHERE id=?;
    `;

    return JSON.parse((await this.dbQuery.queryDb(sql, [id]))[0].selected_students);
  }

  async selectOneBistudent(_tid: number, _bisid: number) {
    const tid = parseInt(_tid as any);
    const bisid = parseInt(_bisid as any);
    const bichoiceInfo = await this.getBiChoiceInfo();
    const current_stage = JSON.parse(bichoiceInfo.current_stage).value;

    if(await this.bistudentIsSelected(bisid)) {
      throw new HttpException({
        msg: '该学生已被选择, 请重试'
      }, 406);
    }

    // 判断这个学生能否被选择:
    const students = await this.getBistudents(tid);
    const current_stage_students = students[current_stage - 1].map(r => r.id);
    if(current_stage_students.indexOf(bisid) === -1) {
      throw new HttpException({
        msg: '无法选择这个学生'
      }, 403);
    }

    const sql = `
      SELECT selected_teachers
      FROM bistudent
      WHERE id=?;
    `;
    const selected_teachers = JSON.parse((await this.dbQuery.queryDb(sql, [bisid]))[0].selected_teachers);
    if(selected_teachers[current_stage - 1] &&
        selected_teachers[current_stage - 1] === tid) {
      const updateSql = `
          UPDATE teacher
          SET selected_students=?
          WHERE id=?;
      `;
      const selectSql = `
          SELECT selected_students
          FROM teacher
          WHERE id=?;
      `;

      const selected_students = JSON.parse((await this.dbQuery.queryDb(selectSql, [tid]))[0].selected_students);
      for(let i = 0;i<current_stage;i+=1) {
        if(selected_students[i] === undefined) {
          selected_students[i] = [];
        }
      }
      selected_students[current_stage - 1].push(bisid);

      await this.dbQuery.queryDb(updateSql, [JSON.stringify(selected_students), tid]);
      
      return {
        msg: '选择成功'
      };
    }

    throw new HttpException({
      msg: '无法选择该学生'
    }, 406);
  }

  async deleteOneBistudent(tid: number, _bisid: number) {
    const bisid = parseInt(_bisid as any);
    if(isNaN(bisid)) {
      throw new HttpException({
        msg: '参数错误'
      }, 406);
    }
    const bichoiceInfo = await this.getBiChoiceInfo();
    const current_stage = JSON.parse(bichoiceInfo.current_stage).value;

    const selectSql = `
      SELECT selected_students
      FROM teacher
      WHERE id=?;
    `;

    const selected_students = JSON.parse((await this.dbQuery.queryDb(selectSql, [tid]))[0].selected_students);

    if(selected_students[current_stage - 1] &&
        selected_students[current_stage - 1].indexOf(bisid) !== -1) {
      selected_students[current_stage - 1].splice(selected_students[current_stage - 1].indexOf(bisid), 1);
      const updateSql = `
        UPDATE teacher
        SET selected_students=?
        WHERE id=?;
      `;

      await this.dbQuery.queryDb(updateSql, [JSON.stringify(selected_students), tid]);

      return {
        msg: '取消选择成功'
      };
    }

    throw new HttpException({
      msg: '取消选择失败'
    }, 406);
  }

  async getOneBistudentFileList(tid: number, bisid: number) {
    let canGet = false;

    const students = await this.getBistudents(tid);
    for(const stage in students) {
      const student = students[stage];
      for(const index in student) {
        if(student[index].id === bisid) {
          canGet = true;
          break;
        }
      }

      if(canGet === true) {
        break;
      }
    }

    if(canGet === true) {
      return await this.bistudentService.getFileList(bisid);
    } 

    throw new HttpException({
      msg: '您没有权限查看'
    }, 403);
  }

  async getOneBistudentFile(tid: number, bisid: number, fid: number) {
    const fileList = await this.getOneBistudentFileList(tid, bisid);
    // 获取bisid的学生的头像:
    const getImageSql = `
      SELECT image
      FROM bistudent
      WHERE id=?;
    `;

    const image = (await this.dbQuery.queryDb(getImageSql, [bisid]))[0].image;
    let canGet = false;

    if(image !== fid) {
      for(const index in fileList) {
        const file = fileList[index];
        if(file.fid === fid) {
          canGet = true;
          break;
        }
      }
    } else {
      canGet = true;
    }

    if(canGet) {
      return await this.bistudentService.getFile(bisid, image, fid);
    }
    throw new HttpException({
      msg: '您没有权限获得此文件'
    }, 403);
  }

  async getMyEnrols(id: number) {
    const configSql = `
      SELECT bichoice_config
      FROM teacher
      WHERE id=?;
    `;

    const bichoice_config = JSON.parse((await this.dbQuery.queryDb(configSql, [id]))[0].bichoice_config);
    const enrols = bichoice_config.enrols;

    const res: {
      id: number,
      num: number,
      description: string,
      count: number,
      selected_students: any[]
    }[] = [];

    const selectSql = `
      SELECT description
      FROM enrol
      WHERE id=?;
    `;

    const selectedStudentSql = `
      SELECT selected_students
      FROM teacher
      WHERE id=?;
    `;

    const getEnrolSql = `
      SELECT enrol.id as enrol
      FROM bistudent
        JOIN degree ON bistudent.degree = degree.id
        JOIN enrol ON degree.enrol = enrol.id
      WHERE bistudent.id=?;
    `;
    const selected_students_from_sql = JSON.parse((await this.dbQuery.queryDb(selectedStudentSql, [id]))[0].selected_students);

    for(const index in enrols) {
      const enrol = enrols[index];
      const description = (await this.dbQuery.queryDb(selectSql, [enrol.id]))[0].description;

      const selected_students = [];
      
      for(const stage in selected_students_from_sql) {
        const students = selected_students_from_sql[stage];
        for(const index in students) {
          const student = students[index];
          const e = (await this.dbQuery.queryDb(getEnrolSql, [student]))[0].enrol;
          if(e === enrol.id) {
            selected_students.push(student)
          }
        }
      }

      res.push({
        id: enrol.id,
        num: enrol.num,
        description: description,
        count: selected_students.length,
        selected_students
      });
    }

    return res;
  }

  async getMyDegrees(id: number) {
    const configSql = `
      SELECT bichoice_config
      FROM teacher
      WHERE id=?;
    `;

    const bichoice_config = JSON.parse((await this.dbQuery.queryDb(configSql, [id]))[0].bichoice_config);
    const degrees = bichoice_config.degrees;

    const res: {
      id: number,
      num: number,
      degree_description: string,
      enrol_description: string,
      count: number,
      selected_students: any[]
    }[] = [];

    const descriptionSql = `
      SELECT degree.description AS degree_description,
        enrol.description AS enrol_description
      FROM degree
        JOIN enrol ON degree.enrol = enrol.id
      WHERE degree.id=?;
    `;

    const selectedStudentSql = `
      SELECT selected_students
      FROM teacher
      WHERE id=?;
    `;
    const selected_students_from_sql = JSON.parse((await this.dbQuery.queryDb(selectedStudentSql, [id]))[0].selected_students);

    const getDegreeSql = `
      SELECT degree
      FROM bistudent
      WHERE id=?;
    `;

    for(const index in degrees) {
      const degree = degrees[index];
      const description = (await this.dbQuery.queryDb(descriptionSql, [degree.id]))[0];
      const degree_description = description.degree_description;
      const enrol_description = description.enrol_description;
      const selected_students = [];
      
      for(const stage in selected_students_from_sql) {
        const students = selected_students_from_sql[stage];
        for(const index in students) {
          const student = students[index];
          const d = (await this.dbQuery.queryDb(getDegreeSql, [student]))[0].degree;
          if(d === degree.id) {
            selected_students.push(student)
          }
        }
      }

      res.push({
        id: degree.id,
        num: degree.num,
        degree_description,
        enrol_description,
        count: selected_students.length,
        selected_students
      });
    }

    return res;
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

  async getBichoiceSummary(id: number) {
    throw new HttpException({
      msg: 'unimplemented!'
    }, 502)
  }

  async getBichoiceFile(id: number) {
    const sql = `
      SELECT port, ffid
      FROM file
      WHERE id=?;
    `;

    const res = (await this.dbQuery.queryDb(sql, [id]))[0]
    const { port, ffid } = res;
    return await FileService.getFile(port, ffid);
  }
}
