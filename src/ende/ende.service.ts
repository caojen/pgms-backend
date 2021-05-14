import { HttpException, Injectable } from '@nestjs/common';

import * as pbkdf2 from 'pbkdf2';

@Injectable()
export class EndeService {

  /**
   * all passwords should be encoded.
   * use this function to decode
   * @param password 
   */
  static decodeFromHttp(password: string): string {
    const buffer = Buffer.from(password, 'base64');
    return buffer.toString();
  }


  /**
   * encode plaintext password to encrypted password
   * @param password plain text
   */
  static encodeToDatabase(password: string): string {
    const salt = this.createNewToken(12);
    const iteration = 10000;
    const hash = pbkdf2.pbkdf2Sync(password, salt, iteration, 32).toString('base64');

    return `pbkdf2_sha256$${iteration}$${salt}$${hash}`;
  }

  /**
   * try to verity the password is valid(same as the database password)
   * @param password plain text
   * @param hash hashed password that stored in database
   */
  static verify(password: string, hash: string): boolean {
    // return password === hash;
    const parts = hash.split('$');
    if(parts.length !== 4) {
      return hash === password;
    }
    const iteration = parseInt(parts[1]);
    const salt = parts[2];
    const password_hash = pbkdf2.pbkdf2Sync(password, salt, iteration, 32).toString('base64');
    return password_hash === parts[3];
  }

  private static readonly charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  // private static readonly tokenlen = 64;
  static createNewToken(len: number = 64): string {
    let str = '';
    for(let i = 0;i<len;i++) {
      const index = Math.random() * this.charset.length;
      str += this.charset.charAt(index);
    }
    return str;
  }
}
