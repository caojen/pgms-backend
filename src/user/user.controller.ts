import { Body, Controller, Post } from '@nestjs/common';
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
  async userLogin(@Body() body: {username: string, password: string}) {
    // 
  }
  
}
