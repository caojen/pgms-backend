import { Body, Controller, Delete, Get, HttpException, Param, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { LoginRequired } from 'src/user/user.guard';
import { TeacherPermission } from './teacher.guard';
import { TeacherService } from './teacher.service';
import { TeacherCanSelect } from './teacher.guard';
import { parse } from 'path';
import { off } from 'process';

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


  /**
   * @api {put} /teacher/info TeacherUpdateInformation
   * @apiName TeacherUpdateInformation
   * @apiGroup Teacher
   * @apiPermission Logined Teacher
   * @apiSuccessExample {json} Success-Response
   * { "msg": "操作成功" }
   */
  @Put('info')
  @UseGuards(LoginRequired, TeacherPermission)
  async updateMyInfo(@Req() req, @Body() body: {
    email: string,
    personal_page: string,
    research_area: string
  }) {
    const tid = req.user.teacher.id;
    return await this.teacherService.updateTeacherInfo(tid, body);
  }

  // for bi-choice:

  /**
   * @api {get} /teacher/bichoice GetBiChoiceInfo
   * @apiName GetBiChoiceInfo
   * @apiGroup Teacher
   * @apiPermission Logined Teacher
   * @apiSuccessExample {json} Success-Response
  {
    "begin_time": "{\"value\":\"2020-11-6 23:16:00\"}",
    "current_stage": "{\"value\":1}",
    "end_time": "{\"value\":\"2020-11-8 23:16:00\"}",
    "stage_count": "{\"value\":3}"
  }
   */
  @Get('bichoice')
  async getBiChoiceInfo() {
    return this.teacherService.getBiChoiceInfo();
  }

  /**
   * @api {get} /teacher/bistudents GetBistudents
   * @apiName GetBistudents
   * @apiGroup Teacher
   * @apiPermission Logined Teacher
   * @apiSuccessExample {json} Success-Response
[
    [
        {
            "id": 1,
            "uid": 11,
            "name": "bistudent",
            "recommended": 0,
            "score": 399,
            "graduation_university": "uni",
            "graduation_major": "maj",
            "household_register": "reg",
            "ethnic": "eth",
            "phone": "phone",
            "gender": "1",
            "email": "mail",
            "source": 1,
            "degree": 1,
            "image": 11,
            "selected_teachers": [
                5
            ]
        }
    ]
]
   */
  @Get('bistudents')
  @UseGuards(LoginRequired, TeacherPermission)
  async getBistudents(@Req() request) {
    const tid = request.user.teacher.id;
    return await this.teacherService.getBistudents(tid);
  }

  /**
   * @api {get} /teacher/bistudents/selected GetSelectedBistudents
   * @apiName GetSelectedBistudents
   * @apiGroup Teacher
   * @apiPermission Logined Teacher
   * @apiSuccessExample {json} Success-Response
  [[1],[2,3,4,5]]
   */
  @Get('bistudents/selected')
  @UseGuards(LoginRequired, TeacherPermission)
  async getSelectedBistudents(@Req() request) {
    const tid = request.user.teacher.id;
    return await this.teacherService.getSelectedBistudents(tid);
  }

  /**
   * @api {put} /teacher/bistudent/:bisid SelectOneBistudent
   * @apiName SelectOneBistudent
   * @apiGroup Teacher
   * @apiPermission Logined Teacher
   * @apiSuccessExample {json} Success-Response
  {
    "msg": "选择成功",
    "selected_students": [[1],[2,3,4]]
  }
  */
  @Put('bistudent/:bisid')
  @UseGuards(LoginRequired, TeacherPermission, TeacherCanSelect)
  async selectOneBistudent(@Req() request, @Param() param: {bisid: string}) {
    const bisid = parseInt(param.bisid);
    const tid = request.user.teacher.id;

    return await this.teacherService.selectOneBistudent(tid, bisid);
  }

  /**
   * @api {delete} /teacher/bistudent/:bisid DeleteOneBistudent
   * @apiName DeleteOneBistudent
   * @apiGroup Teacher
   * @apiPermission Logined Teacher
   * @apiSuccessExample {json} Success-Response
  {
    "msg": "取消选择成功",
    "selected_students": [[1],[2,3,4]]
  }
  */
  @Delete('bistudent/:bisid')
  @UseGuards(LoginRequired, TeacherPermission, TeacherCanSelect)
  async deleteOneBistudent(@Req() request, @Param() param: {bisid: string}) {
    const bisid = parseInt(param.bisid);
    const tid = request.user.teacher.id;

    return await this.teacherService.deleteOneBistudent(tid, bisid);
  }

  /**
   * @api {get} /teacher/bistudent/:bisid/files GetOneBistudentFileList
   * @apiName GetOneBistudentFileList
   * @apiGroup Teacher
   * @apiPermission Logined Teacher
   * @apiSuccessExample {json} Success-Response
  [
    {
      "filename": "abc",
      "fid": 1
    }
  ]
  */
  @Get('bistudent/:bisid/files')
  @UseGuards(LoginRequired, TeacherPermission)
  async getOneBistudentFileList(@Req() request, @Param() param: {bisid: string}) {
    const bisid = parseInt(param.bisid);
    const tid = request.user.teacher.id;

    return await this.teacherService.getOneBistudentFileList(tid, bisid);
  }

  /**
   * @api {get} /teacher/bistudent/:bisid/file/:fid GetOneBistudentOneFile
   * @apiName GetOneBistudentOneFile
   * @apiGroup Teacher
   * @apiPermission Logined Teacher
  */
  @Get('bistudent/:bisid/file/:fid')
  @UseGuards(LoginRequired, TeacherPermission)
  async getOneBistudentOneFile(@Req() request, @Param() param: {bisid: string, fid: string}, @Res() response) {
    const bisid = parseInt(param.bisid);
    const fid = parseInt(param.fid);
    const tid = request.user.teacher.id;
    const content = await this.teacherService.getOneBistudentFile(tid, bisid, fid);
    response.end(Buffer.from(content));
  }

  /**
   * @api {get} /teacher/enrols GetEnrols
   * @apiName GetEnrols
   * @apiGroup Teacher
   * @apiPermission Logined Teacher
   * @apiSuccessExample {json} Success-Response
  [
    {
        "id": 1,
        "num": 3,
        "description": "enrol",
        "count": 1,
        "selected_students": [
            1
        ]
    }
  ]
  */
  @Get('enrols')
  @UseGuards(LoginRequired, TeacherPermission)
  async getMyEnrols(@Req() request) {
    const id = request.user.teacher.id;
    return await this.teacherService.getMyEnrols(id);
  }

  /**
   * @api {get} /teacher/degrees GetDegrees
   * @apiName GetDegrees
   * @apiGroup Teacher
   * @apiPermission Logined Teacher
   * @apiSuccessExample {json} Success-Response
  [
    {
        "id": 1,
        "num": 3,
        "degree_description": "degree",
        "enrol_description": "enrol",
        "count": 1,
        "selected_students": [
            1
        ]
    }
  ]
  */
  @Get('degrees')
  @UseGuards(LoginRequired, TeacherPermission)
  async getMyDegrees(@Req() request) {
    const id = request.user.teacher.id;
    return await this.teacherService.getMyDegrees(id);
  }

  @Get('lectures')
  @UseGuards(LoginRequired, TeacherPermission)
  async getLectures(@Query() query: {
    pageSize: string,
    offset: string
  }) {
    const { pageSize, offset } = query;
    const p = parseInt(pageSize)
    const o = parseInt(offset)
    if(isNaN(p) || isNaN(o)) {
      throw new HttpException({
        msg: '参数错误'
      }, 406)
    }
    return this.teacherService.getLectures(p, o)
  }

  @Get('bichoice/summary')
  @UseGuards(LoginRequired, TeacherPermission)
  async getBichoiceSummary(@Req() request) {
    const id = request.user.teacher.id;
    return await this.teacherService.getBichoiceSummary(id);
  }

}
