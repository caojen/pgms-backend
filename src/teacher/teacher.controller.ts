import { Controller, Get, HttpException, Param, Query, Req, UseGuards } from '@nestjs/common';
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


  /**
   * @api {get} /teacher/student/:id GetStudentRecords
   * @apiName GetStudentRecords
   * @apiGroup Teacher
   * @apiParam (query string) pageSize
   * @apiParam (query string) offset
   * @apiPermission Logined Teacher HasStudent
   * @apiSuccessExample {json} Success-Response
  * {
      "total": 2,
      "records": [
          {
              "id": 1,
              "rtime": "2020-10-07T15:08:46.000Z",
              "position": "testposition",
              "detail": {
                  "title": "lecture1",
                  "content": "content1",
                  "start": "2020-10-07T15:07:00.000Z",
                  "end": "2020-10-09T15:07:00.000Z"
              }
          },
          {
              "id": 2,
              "rtime": "1999-05-24T16:25:00.000Z",
              "position": "testposition",
              "detail": {
                  "title": "日常考勤"
              }
          }
      ]
  }
   * 
   */
  @Get('student/:id')
  @UseGuards(LoginRequired, TeacherPermission)
  async getOneStudentsRecord(@Req() req, @Param() param: {id: number}, @Query() query: {pageSize: number, offset: number}) {
    const tid = req.user.teacher.id;
    const sid = param.id;
    const pageSize = query.pageSize;
    const offset = query.offset;

    if(isNaN(pageSize) || isNaN(offset)) {
      throw new HttpException({
        msg: '参数错误'
      }, 406);
    }

    return await this.teacherService.getAllRecordsOfOneStudent(tid, sid, pageSize, offset);
  }
}
