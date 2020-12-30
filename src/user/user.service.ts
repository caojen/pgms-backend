import { HttpException, Injectable } from '@nestjs/common';
import { EndeService } from 'src/ende/ende.service';
import { QueryDbService } from 'src/query-db/query-db.service';

@Injectable()
export class UserService {

  constructor(
    private readonly dbService: QueryDbService
  ) {}


  /**
   * get more information of user with uid
   * @param uid 
   */
  async getUserBasicInfo(uid: number) {
    const userSql = `
      SELECT username
      FROM user
      where id=?;
    `;
    const username = (await this.dbService.queryDb(userSql, [uid]))[0]?.username;
    let res: any = {
      uid,
      username
    };

    // Add more models here.

    {
      // to test if user is a student
      const studentSql = `
        SELECT id, name, sid, email
        FROM student
        WHERE uid=?;
      `;
      const query = (await this.dbService.queryDb(studentSql, [uid]))[0];
      if(!!query) {
        res = {
          ...res,
          student: {
            id: query.id,
            name: query.name,
            sid: query.sid,
            email: query.email,
          },
        };
      }
    }

    {
      // to test if user is a teacher
      const teacherSql = `
        SELECT id, name, personal_page, research_area, email
        FROM teacher
        WHERE uid=?;
      `;

      const query = (await this.dbService.queryDb(teacherSql, [uid]))[0];
      if(!!query) {
        res = {
          ...res,
          teacher: {
            ...query,
          }
        };
      }
    }

    {
      // to test if user is a admin
      const adminSql = `
        SELECT id, name, type
        FROM admin
        WHERE uid=?;
      `;
      const query = (await this.dbService.queryDb(adminSql, [uid]))[0];
      if(!!query) {
        res = {
          ...res,
          admin: {
            ...query,
          },
        };
      }
    }

    {
      // if user is student, then it will not be bistudent
      if(!res['student']) {
        // to test if user is bistudent
        const bistudentSql = `
          SELECT bistudent.id as id, name, recommended, score,
            graduation_university, graduation_major, graduation_university,
            household_register, ethnic, phone, gender, email,
            source.description as source_des,
            degree.description as degree_des,
            enrol.description as enrol_des,
            image, selected_teachers
          FROM bistudent
            JOIN source ON bistudent.source = source.id
            JOIN degree ON bistudent.degree = degree.id
            JOIN enrol ON degree.enrol = enrol.id
          WHERE uid=?;
        `;
        const query = (await this.dbService.queryDb(bistudentSql, [uid]))[0];
        if(!!query) {
          res = {
            ...res,
            bistudent: {
              ...query
            },
          };
        }
      }
    }

    return res;
  }

  /**
   * 
   * @param username 
   * @param password plaintext
   */
  async userLogin(username: string, password: string): Promise<false | {token: string, body: any}> {
    const sql = `
      SELECT id, password
      FROM user
      WHERE username=? and isActive=1;
    `;

    const res = await this.dbService.queryDb(sql, [username]);

    if(res?.length === 1) {
      const uid: number = res[0]?.id;
      const hash: string = res[0]?.password;
      const verify = EndeService.verify(password, hash);

      if(verify) {
        // password is valid
        const token: string = EndeService.createNewToken();
        const updateToken = `
          insert into token(uid, value)
          values(?, ?)
          on duplicate key update value=?;
        `;
        await this.dbService.queryDb(updateToken, [uid, token, token]);

        return {
          token,
          body: await this.getUserBasicInfo(uid),
        };
      } else {
        return false;
      }
    } else if(res?.length === 0) {
      return false;
    } else {
      throw new HttpException({
        msg: '数据库查询错误',
      }, 500);
    }
  }

  /**
   * base on given token, return the uid or null if not exists
   * @param token 
   */
  async getUidByToken(token: string): Promise<number | null> {
    const sql = `
      SELECT user.id as id
      FROM token JOIN user on token.uid = user.id
      WHERE token.value=?;
    `;
    const res = await this.dbService.queryDb(sql, [token]);
    if(res.length === 0) {
      return null;
    } else {
      return res[0]?.id;
    }
  }

  /**
   * User Logout
   * @param uid 
   */
  async userLogout(uid: number) {
    const sql = `
      UPDATE token
      SET value=''
      WHERE uid=?;
    `;
    await this.dbService.queryDb(sql, [uid]);
    return true;
  }

  async changePasswordForUser(uid: number, oldpassword: string, newpassword: string) {
    const NEED_CHECK_OLD_PASSWORD = false;

    if(NEED_CHECK_OLD_PASSWORD) {
      // need to check old password here...
      const selectPassword = `
        SELECT password
        FROM user
        WHERE user.id=?;
      `;
      const currentPasswordHash = (await this.dbService.queryDb(selectPassword, [uid]))[0]?.password;
      const verify = EndeService.verify(oldpassword, currentPasswordHash);
      if(!verify) {
        throw new HttpException({
          msg: '原密码不正确'
        }, 403);
      }
    }

    const epassword = EndeService.encodeToDatabase(newpassword);

    const updatePassword = `
      UPDATE user
      SET password=?
      WHERE user.id=?;
    `;

    await this.dbService.queryDb(updatePassword, [epassword, uid]);
    return {
      msg: '修改密码成功'
    };
  }

  async userLoginWithToken(token: string): Promise<false | {token: string, body: any}> {
    const uid = await this.getUidByToken(token)
    if(uid) {
      const body = await this.getUserBasicInfo(uid)
      const token: string = EndeService.createNewToken();
      const updateToken = `
        insert into token(uid, value)
        values(?, ?)
        on duplicate key update value=?;
      `;
      await this.dbService.queryDb(updateToken, [uid, token, token]);
      return {
        token,
        body
      }
    } else {
      return false
    }
  }
}
