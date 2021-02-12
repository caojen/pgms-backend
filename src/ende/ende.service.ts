import { Injectable } from '@nestjs/common';

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
   * @param password 
   */
  static encodeToDatabase(password: string): string {
    return password;
  }

  /**
   * try to verity the password is valid(same as the database password)
   * @param password 
   * @param hash 
   */
  static verify(password: string, hash: string): boolean {
    return password === hash;
  }

  private static readonly charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  private static readonly tokenlen = 64;
  static createNewToken(): string {
    let str = '';
    for(let i = 0;i<this.tokenlen;i++) {
      const index = Math.random() * this.charset.length;
      str += this.charset.charAt(index);
    }
    return str;
  }
}
