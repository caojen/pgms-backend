import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { LoginRequired } from 'src/user/user.guard';
import { StudentPermission } from './student.guard';
import { StudentService } from './student.service';

@Controller('student')
export class StudentController {

  constructor(
    private readonly studentService: StudentService
  ) {}

  /**
   * @api {get} /student/teacher StudentGetTeacher
   * @apiName StudentGetTeacher
   * @apiGroup Student
   * @apiPermission Logined Student
   * @apiSuccessExample {json} success-reponse
   *{
   *     "name": "teacher",
   *     "email": "abc@mail.qq.com",
   *     "personal_page": "abc",
   *     "research_area": "edf"
   * }
   */
  @Get('teacher')
  @UseGuards(LoginRequired, StudentPermission)
  async getMyTeacher(@Req() req) {
    const sid = req.user.student.id;
    return await this.studentService.getTeacherOfStudent(sid);
  }

  /**
   * @api {put} /student/email StudentChangeEmail
   * @apiName StudentChangeEmail
   * @apiGroup Student
   * @apiPermission Logined User
   * @apiSuccessExample {json} Success-Response
   * {
   *    "msg": "操作成功"
   * }
   */
  @Put('email')
  @UseGuards(LoginRequired, StudentPermission)
  async changeMyEmail(@Req() req, @Body() body: {email: string}) {
    const sid = req.user.student.id;
    const email = body.email;

    await this.studentService.changeEmailForStudent(sid, email);
    return {
      msg: '修改成功'
    };
  }
}
