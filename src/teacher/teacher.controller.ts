import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { LoginRequired } from 'src/user/user.guard';
import { TeacherPermission } from './teacher.guard';
import { TeacherService } from './teacher.service';

@Controller('teacher')
export class TeacherController {

  constructor(
    private readonly teacherService: TeacherService
  ) {}

  /**
   * @api {get} /teacher/students GetAllStudents
   * @apiName GetAllStudents
   * @apiPermission Logined Teacher
   * @apiGroup Teacher
   * @apiSuccessExample {json} Success-Response
   *  [
   *       {
   *           "id": 1,
   *           "name": "admin",
   *           "email": "efbffcbc@mail2.sysu.edu.cn",
   *           "latestRecordTime": "2020-10-07T15:08:46.000Z"
   *       }
   *   ]
   * 
   */
  @Get('students')
  @UseGuards(LoginRequired, TeacherPermission)
  async getMyStudents(@Req() req) {
    const tid = req.user.teacher.id;
    return await this.teacherService.getAllStudentsOfTeacher(tid);
  }
}
