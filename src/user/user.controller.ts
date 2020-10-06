import { Body, Controller, HttpException, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { EndeService } from 'src/ende/ende.service';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  // we don't provide a register api for any new user
  // use admin module to do it.

  constructor(
    private readonly userService: UserService
  ) {}

  /**
   * @api {post} /user/login
   * @apiName UserLogin
   * @apiGroup User
   * @apiSuccessExample {json} Success-Response:
   *  HTTP/1.1 200 OK
   *  {
   *    "uid": 1,
   *    "username": "18542100",
   *    "student": {
   *      "name": "jack",
   *      "student_id": "18542100",
   *      "teacher": {
   *          "name": "yangyonghong"
   *      }
   *    }
   *  }
   * @apiError LoginFailed Username not exists, or password error
   * @apiError HasLogined There's a logined user, need to logout first
   */
  @Post('login')
  async userLogin(@Req() req: Request, @Body() body: {username: string, password: string}, @Res() res: Response) {
    // To test if logined:
    if(req.headers["x-token"]) {
      throw new HttpException({
        msg: '当前浏览器已登录用户, 请注销后重试',
      }, 406);
    }

    const originPassword = EndeService.decodeFromHttp(body.password);
    const loginResult = await this.userService.userLogin(body.username, originPassword);
    if(loginResult === false) {
      throw new HttpException({
        msg: '用户名不存在或密码错误',
      }, 403);
    } else {
      // set cookie:
      res.setHeader("token", loginResult.token);
      res.json(loginResult.body);
    }
  }
}
