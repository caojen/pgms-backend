import { Body, Controller, Get, HttpException, Param, Put, Query, Req, UseGuards } from '@nestjs/common';
import { query } from 'express';
import { off } from 'process';
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

  /**
   * @api {get} /student/records GetStudentAllRecords
   * @apiName GetStudentAllRecords
   * @apiParam (query string) {int} pageSize
   * @apiParam (query String) {int} offset
   * @apiGroup Student
   * @apiPermission Logined Student
   * @apiSuccessExample {json} Success-Response
   * {
   *    "total": 1,
   *    "records": [
   *    {
   *         "id": 1,
   *         "rtime": "2020-10-07T15:08:46.000Z",
   *         "position": "testposition",
   *         "detail": {
   *             "title": "lecture1",
   *             "content": "content1",
   *             "start": "2020-10-07T15:07:00.000Z",
   *             "end": "2020-10-09T15:07:00.000Z"
   *         }
   *     }
   * ]
   * }
   * 
   */
  @Get('records')
  @UseGuards(LoginRequired, StudentPermission)
  async getRecords(@Req() req, @Query() query: {pageSize: number, offset: number}) {
    const sid = req.user.student.id;
    const pageSize = query.pageSize;
    const offset = query.offset;
    if(isNaN(pageSize) || isNaN(offset)) {
      throw new HttpException({
        msg: '参数错误'
      }, 406);
    }

    return await this.studentService.getRecords(sid, pageSize, offset);
  }
}
