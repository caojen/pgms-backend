import { HttpException, Injectable } from '@nestjs/common';
import * as requestAsync from 'request-promise-native';

@Injectable()
export class FileService {
/*
与文件上传下载相关的内容:
https://docs.nestjs.com/techniques/file-upload
https://github.com/expressjs/multer
https://www.npmjs.com/package/request-promise-native
*/
  
  static filesystem = "http://124.70.215.24";
  static lookup = ":9333/dir/assign";

  private static async getUsablePortAndUri(): Promise<[string, string]> {
    const response = await requestAsync(`${this.filesystem}${this.lookup}`);
    const body = JSON.parse(response);
    const uri = body?.fid;
    const port = body.publicUrl?.split(':')[1];
    if(!uri || !port) {
      throw new HttpException({
        msg: '文件系统错误'
      }, 500);
    }
    return [port, uri];
  }

  static async getFile(port: string, uri: string) {
    try {
      const response = await requestAsync(`${this.filesystem}:${port}/${uri}`, {
        method: 'GET',
        encoding: null,
      })
      return response;
    } catch (e) {
      throw new HttpException({
        msg: '文件系统错误',
        err: e.name
      }, 500);
    }
  }

  static async postFile(filename: string, buffer: Buffer): Promise<[string, string]> {

    const [port, uri] = await this.getUsablePortAndUri();

    const options = {
      method: 'POST',
      formData: {
        [filename]: buffer
      },
    };

    await requestAsync(`${this.filesystem}:${port}/${uri}`, options);
    return [port, uri];
  }

}
