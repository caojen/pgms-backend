import { Injectable } from '@nestjs/common';

@Injectable()
export class EndeService {

  /**
   * all passwords should be encoded.
   * use this function to decode
   * @param password 
   */
  static decodeFromHttp(password: string): string {
    return password;
  }
}
