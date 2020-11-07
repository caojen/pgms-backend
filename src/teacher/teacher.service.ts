import { HttpException, Injectable } from '@nestjs/common';
import { BistudentService } from 'src/bistudent/bistudent.service';
import { QueryDbService } from 'src/query-db/query-db.service';
import { StudentService } from 'src/student/student.service';

@Injectable()
export class TeacherService {

  constructor(
    private readonly dbQuery: QueryDbService,
    private readonly studentService: StudentService,
    private readonly bistudentService: BistudentService,
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

  async getBistudents(id: number) {
    try {
      const bichoiceInfo = await this.getBiChoiceInfo();
      const current_stage = JSON.parse(bichoiceInfo.current_stage).value;
      const stage_count = JSON.parse(bichoiceInfo.stage_count).value;
      if(current_stage <= 0) {
        return [];
      }

      const res = [];

      const selectedSql = `
        SELECT selected_students
        FROM teacher
        WHERE id=?;
      `;

      const selected_students = JSON.parse((await this.dbQuery.queryDb(selectedSql, [id]))[0].selected_students);
      for(let stage = 0; stage < current_stage-1; stage += 1) {
        if(res[stage] === undefined) {
          res[stage] = [];
        }
        const students = selected_students[stage];
        if(students !== undefined) {
          for(const index in students) {
            const student = students[index];
            res[stage].push(await this.bistudentService.getInfo(student));
          }
        }
      }

      const studentsSql = `
        SELECT *
        FROM bistudent;
      `;
      const students = await this.dbQuery.queryDb(studentsSql, []);
    
      for(const index in students) {
        const student = students[index];
        student.selected_teachers = JSON.parse(student.selected_teachers);

        for(let stage = current_stage-1; stage < stage_count; stage += 1) {
          if(student.selected_teachers[stage] === id && await this.bistudentIsSelected(student.id) === false) {
            if(res[stage] === undefined) {
              res[stage] = [];
            }

            res[stage].push(student);
          }
        }

        if(!!selected_students[current_stage - 1] &&
            selected_students[current_stage - 1].indexOf(student.id) !== -1) {
          if(res[current_stage-1] === undefined) {
            res[current_stage-1] = [];
          }

          res[current_stage-1].push(student);
        }
      }
      return res;
    } catch (err) {
      throw new HttpException({
        msg: '服务器错误',
        err
      }, 500);
    }
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
      const selected_students = (await this.dbQuery.queryDb(teacherSelectedSql, [teacher]))[0].selected_students;
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

  async selectOneBistudent(tid: number, bisid: number) {
    const bichoiceInfo = await this.getBiChoiceInfo();
    const current_stage = JSON.parse(bichoiceInfo.current_stage).value;

    if(await this.bistudentIsSelected(bisid)) {
      throw new HttpException({
        msg: '该学生已被选择, 请刷新重试'
      }, 406);
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
        msg: '选择成功',
        selected_students
      };
    }

    throw new HttpException({
      msg: '无法选择该学生'
    }, 406);
  }

  async deleteOneBistudent(tid: number, bisid: number) {
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
}
