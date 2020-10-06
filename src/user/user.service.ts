import { Injectable } from '@nestjs/common';
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
    return {
      test: 'ok'
    }
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
    const uid: number = res[0];
    const hash: string = res[1];
    if(EndeService.verify(password, hash)) {
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
  }
}
