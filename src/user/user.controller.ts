import { Body, Controller, Delete, Get, HttpException, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { EndeService } from 'src/ende/ende.service';
import { LoginRequired } from './user.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  // we don't provide a register api for any new user
  // use admin module to do it.

  constructor(
    private readonly userService: UserService
  ) {}

  /**
   * @api {post} /user/login UserLogin
   * @apiName UserLogin
   * @apiGroup User
   * @apiSuccessExample {json} Success-Response
   *  HTTP/1.1 200 OK
   *  {
   *    "uid": 1,
   *    "username": "18542100",
   *    "student": {
   *      "id": 5
   *      "name": "jack",
   *      "sid": "18542100",
   *      "email": "ab@qq.com"
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
      res.setHeader("Set-Cookie", `token=${loginResult.token}; path=/; SameSite=None; Secure`);
      res.json(loginResult.body);
    }
  }

  /**
   * @api {delete} /user/logout UserLogout
   * @apiName UserLogout
   * @apiGroup User
   * @apiPermission Logined
   * @apiSuccessExample {json} Success-Response
   * {
   *    "msg": "操作成功"
   * }
   */
  @Delete('logout')
  @UseGuards(LoginRequired)
  async userLogout(@Req() req) {
    const uid = req.user.uid;
    await this.userService.userLogout(uid);
    return {
      msg: '操作成功'
    }
  }


  /**
   * @api {get} /user/status CurrentUserStatus
   * @apiName GetUserStatus
   * @apiGroup User
   * @apiPermission Logined
   * @apiSuccessExample {json} Success-Response
   *  HTTP/1.1 200 OK
   *  {
   *    "uid": 1,
   *    "username": "18542100",
   *    "student": {
   *      "id": 5
   *      "name": "jack",
   *      "sid": "18542100",
   *      "email": "ab@qq.com"
   *    }
   *  }
   */
  @Get('status')
  @UseGuards(LoginRequired)
  async getCurrentUser(@Req() req) {
    const uid = req.user.uid;
    return await this.userService.getUserBasicInfo(uid);
  }


  /**
   * @api {put} /user/password ChangePassword
   * @apiName UserChangePassword
   * @apiGroup User
   * @apiPermission Logined
   * @apiSuccessExample {json} Success-Response
   * {
   *    "msg": "修改密码成功"
   * }
   */
  @Put('password')
  @UseGuards(LoginRequired)
  async changePassword(@Req() req, @Body() body: {oldpassword: string, newpassword: string}) {
    const uid = req.user.uid;
    return await this.userService.changePasswordForUser(uid, body.oldpassword, body.newpassword);
  }

  @Post('token')
  async loginWithToken(@Body() body: {token: string}, @Res() res: Response) {
    const { token } = body;
    const loginResult = await this.userService.userLoginWithToken(token);

    if(loginResult === false) {
      throw new HttpException({
        msg: '用户名不存在或密码错误',
      }, 403);
    } else {
      // set cookie:
      res.setHeader("Set-Cookie", `token=${loginResult.token}; path=/; SameSite=None; Secure`);
      res.json(loginResult.body);
    }
  }
}
