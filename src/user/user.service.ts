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
    const res = {
      uid,
      username
    };

    // Add more models here.

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

  async userLogout(uid: number) {
    const sql = `
      UPDATE token
      SET value=''
      WHERE uid=?;
    `;
    await this.dbService.queryDb(sql, [uid]);
  }
}
