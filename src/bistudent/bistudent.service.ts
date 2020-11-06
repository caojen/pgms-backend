import { HttpException, Injectable } from '@nestjs/common';
import { QueryDbService } from 'src/query-db/query-db.service';

@Injectable()
export class BistudentService {

  constructor(
    private readonly dbQuery: QueryDbService
  ) {}

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

    return res;
  }

  async updateInfo(id: number, {phone, email}) {
    const sql = `
      UPDATE bistudent
      SET phone = ?, email = ?
      WHERE id = ?;
    `;

    await this.dbQuery.queryDb(sql, [phone, email, id]);
    return {
      msg: '修改信息成功'
    };
  }

  async getAllTeachers(id: number) {
    // get degree:
    const degreeSql = `
      SELECT degree
      FROM bistudent
      WHERE id=?;
    `;
    const degree_id = (await this.dbQuery.queryDb(degreeSql, [id]))[0].degree;

    // get enrol:
    const enrolSql = `
      SELECT enrol
      FROM degree
      WHERE id=?;
    `;
    const enrol_id = (await this.dbQuery.queryDb(enrolSql, [id]))[0].enrol;

    const teachersSql = `
      SELECT id, name, email, personal_page, research_area, bichoice_config
      FROM teacher;
    `;

    const teachers = await this.dbQuery.queryDb(teachersSql, []);
    
    const res = [];

    for(const index in teachers) {
      const teacher = teachers[index];
      const config = JSON.parse(teacher.bichoice_config);
      const degrees = config["degrees"];
      for(const dindex in degrees) {
        const degree = degrees[dindex];
        if(degree.id === degree_id && degree.num > 0) {

          let canChoose = false;
          for(const eindex in config["enrols"]) {
            const enrol = config["enrols"][eindex];
            if(enrol.id == enrol_id) {
              if(enrol.num > 0) {
                canChoose = true;
              }
            }
            break;
          }

          if(canChoose) {
            res.push({
              id: teacher.id,
              name: teacher.name,
              email: teacher.email,
              personal_page: teacher.personal_page,
              research_area: teacher.research_area
            });
          }
          break;
        }
      }
    }

    return res;
  }

  async selectOneTeacher(bid: number, tid: number) {
    const teachers = await this.getAllTeachers(bid);
    let canChoose = false;
    for(const index in teachers) {
      const teacher = teachers[index];
      if(teacher.id === tid) {
        canChoose = true;
        break;
      }
    }

    if(canChoose === false) {
      throw new HttpException({
        msg: '该老师不在可选范围之内'
      }, 406);
    }

    const selectSql = `
      SELECT selected_teachers
      FROM bistudent
      WHERE id=?;
    `;

    const selected_teachers = JSON.parse(
      (await this.dbQuery.queryDb(selectSql, [bid]))[0].selected_teachers
    );
    if(selected_teachers.indexOf(tid) !== -1) {
      throw new HttpException({
        msg: '该老师已被选择, 无需重复选择'
      }, 406);
    }

    selected_teachers.push(tid);
    const length = selected_teachers.length;
    const updateSql = `
      UPDATE bistudent
      SET selected_teachers=?
      WHERE id=?;
    `;
    await this.dbQuery.queryDb(updateSql, [JSON.stringify(selected_teachers), bid]);
    return {
      msg: '选择成功',
      tid,
      length,
    };
  }

  async deleteOneTeacher(bid: number, tid: number) {
    const selectSql = `
      SELECT selected_teachers
      FROM bistudent
      WHERE id=?;
    `;

    const selected_teachers: number[] = JSON.parse(
      (await this.dbQuery.queryDb(selectSql, [bid]))[0].selected_teachers
    );

    const index = selected_teachers.indexOf(tid);
    if(index === -1) {
      throw new HttpException({
        msg: '未选择该老师, 无法取消选择'
      }, 406);
    }

    selected_teachers.splice(index, 1);
    const updateSql = `
      UPDATE bistudent
      SET selected_teachers=?
      WHERE id=?;
    `;
    await this.dbQuery.queryDb(updateSql, [JSON.stringify(selected_teachers), bid]);
    return {
      msg: '取消选择成功',
      selected_teachers
    };
  }
}
