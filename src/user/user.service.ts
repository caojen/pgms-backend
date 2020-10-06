import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  
  /**
   * 
   * @param username 
   * @param password plaintext
   */
  async userLogin(username: string, password: string): Promise<false | {token: string, body: JSON}> {
    return false;
  }
}
