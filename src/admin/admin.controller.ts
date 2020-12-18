import { Controller, Get, Query, Req, HttpException, UseGuards, Param, Put, Body, Post, Delete, Res } from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginRequired } from 'src/user/user.guard';
import { AttendAdminPermission, BiChoiceAdminPermission } from './admin.guard';
import { EndeService } from 'src/ende/ende.service';
import { BistudentCanSelect } from 'src/bistudent/bistudent.guard';
import { get } from 'request-promise-native';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService
  ) {}

  /**
   * @api {get} /admin/attend/students GetAllAttendStudents
   * @apiName GetAllAttendStudents
   * @apiGroup AttendAdmin
   * @apiPermission Logined AttendAdmin
   * @apiSuccessExample {json} Success-Response
   * {
   *  "id:" 1,
   *  "name": "jack",
   *  "student_id": "18342005",
   *  "email": "jack@qq.com",
   *  "user": {
   *    "id": 1,
   *    "username": "18342005"
   *  }
   * }
   */
  @Get('attend/students')
  @UseGuards(LoginRequired, AttendAdminPermission)
  async getAllAttendStudents(@Query() query: {
    pageSize: number,
    offset: number,
    queryName: string,
    queryUsername: string
  }) {
    const pageSize = query.pageSize;
    const offset = query.offset;

    const queries = {
      name: query.queryName,
      username: query.queryUsername
    };

    if(isNaN(pageSize) || isNaN(offset)) {
      throw new HttpException({
        msg: '参数错误'
      }, 406);
    }
    return await this.adminService.getAllAttendStudents(pageSize, offset, queries);
  }

  /**
   * @api {get} /admin/attend/student/:sid GetStudentInfo
   * @apiName GetStudentInfo
   * @apiGroup AttendAdmin
   * @apiPermission Logined AttendAdmin
   * @apiSuccessExample {json} Success-Response
{
  "id": 1,
  "name": "admin",
  "email": "mail@qq.com",
  "student_id": "18342005",
  "teacher": {
    "id": 1,
    "name": "teachername",
    "temail": "mail2@qq.com",
    "personal_page": "www.baidu.com",
    "research_area": "are, ee, test"
  }
}
   */
  @Get('attend/student/:sid')
  @UseGuards(LoginRequired, AttendAdminPermission)
  async getOneStudentInfo(@Param() param: {sid: number}) {
    return await this.adminService.getStudentInfo(param.sid);
  }

  /**
   * @api {get} /admin/attend/student/:sid/records GetStudentRecords
   * @apiName GetStudentRecords 
   * @apiGroup AttendAdmin
   * @apiPermission Logined AttendAdmin
   * @apiParam (query string) pageSize
   * @apiParam (query string) offset
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
   */
  @Get('attend/student/:sid/records')
  @UseGuards(LoginRequired, AttendAdminPermission)
  async getStudentRecords(@Param() param: {sid: number}, @Query() query: {pageSize: number, offset: number}) {
    const { sid } = param;
    const { pageSize, offset } = query;
    if(isNaN(pageSize) || isNaN(offset)) {
      throw new HttpException({
        msg: '参数错误'
      }, 406);
    }

    return await this.adminService.getStudentRecords(sid, pageSize, offset);
  }

  /**
   * @api {get} /admin/attend/settings GetSettings
   * @apiName GetSettings
   * @apiGroup AttendAdmin
   * @apiPermission Logined AttendAdmin
   * @apiSuccessExample {json} Success-Response
   * [
   *  {
   *    "key": "setting_key",
   *    "value": "setting_val, may be string, array, or number",
   *    "lastUpdateTime": "2020-09-01 11:15:00",
   *    "lastUpdateAdmin": {
   *      "name": "adminname",
   *      "type": "admintype"
   *    }
   *  }
   * ]
   */
  @Get('attend/settings')
  @UseGuards(LoginRequired, AttendAdminPermission)
  async getSettings() {
    return await this.adminService.getSettings();
  }

  /**
   * @api {put} /admin/attend/setting UpdateOrInsertSetting
   * @apiName UpdateOrInsertSetting
   * @apiGroup AttendAdmin
   * @apiPermission Logined AttendAdmin
   */
  @Put('attend/setting')
  @UseGuards(LoginRequired, AttendAdminPermission)
  async updateOrInsertSetting(@Req() req, @Body() body: {key: string, value: string}) {
    const id = req.user.admin.id;
    const {key, value} = body;
    return await this.adminService.updateOrInsertSetting(id, key, value);
  }

  /**
   * @api {get} /admin/attend/teachers GetAllTeachers
   * @apiName GetAllTeachers
   * @apiGroup AttendAdmin
   * @apiPermission Logined AttendAdmin
   */
  @Get('attend/teachers')
  @UseGuards(LoginRequired, AttendAdminPermission)
  async getAllTeachers(@Query() query: {pageSize: number, offset: number}) {
    const { pageSize, offset } = query;
    if(isNaN(pageSize) || isNaN(offset)) {
      throw new HttpException({
        msg: '参数错误'
      }, 406);
    }
    return await this.adminService.getAllTeachers(pageSize, offset);
  }

  /**
   * @api {get} /admin/attend/teacher/:tid GetOneTeacherInfo
   * @apiName GetOneTeacherInfo
   * @apiGroup AttendAdmin
   * @apiPermission Logined AttendAdmin
   */
  @Get('attend/teacher/:tid')
  @UseGuards(LoginRequired, AttendAdminPermission)
  async getOneTeacherInfo(@Param() param: {tid: number}) {
    const { tid } = param;
    return await this.adminService.getOneTeacherInfo(tid);
  }

  /**
   * @api {get} /admin/attend/lectures GetAllLectures
   * @apiName GetAllLectures
   * @apiGroup AttendAdmin
   * @apiPermission Logined AttendAdmin
   * @apiParam (query string) {int} pageSize
   * @apiParam (query string) {int} offset
   */
  @Get('attend/lectures')
  @UseGuards(LoginRequired, AttendAdminPermission)
  async getAllLectures(@Query() query: {pageSize: number, offset: number}) {
    const {pageSize, offset} = query;
    if(isNaN(pageSize) || isNaN(offset)) {
      throw new HttpException({
        msg: '参数错误'
      }, 406);
    }

    return await this.adminService.getAllLectures(pageSize, offset);
  }

  /**
   * @api {get} /admin/attend/positions GetAllPositions
   * @apiName GetAllPositions
   * @apiGroup AttendAdmin
   * @apiPermission Logined AttendAdmin
   * @apiSuccessExample {json} Success-Response
[
    {
        "id": 1,
        "description": "testposition",
        "device": "device1"
    }
]
   */
  @Get('attend/positions')
  @UseGuards(LoginRequired, AttendAdminPermission)
  async getAllPositions() {
    return await this.adminService.getAllPositions();
  }

  /**
   * @api {put} /admin/attend/position/:pid ChangeOnePosition
   * @apiName ChangeOnePosition
   * @apiGroup AttendAdmin
   * @apiPermission Logined AttendAdmin
   * @apiSuccessExample {json} Success-Response
{
    "msg": "操作成功"
}
   */
  @Put('attend/position/:pid')
  @UseGuards(LoginRequired, AttendAdminPermission)
  async changeOnePosition(@Param() param: {pid: number}, @Body() body: {description: string, device: string}) {
    const { pid }= param;
    const { description, device } = body;
    
    return await this.adminService.changeOnePosition(pid, description, device);
  }

    /**
   * @api {post} /admin/attend/position AddOnePosition
   * @apiName AddOnePosition
   * @apiGroup AttendAdmin
   * @apiPermission Logined AttendAdmin
   * @apiSuccessExample {json} Success-Response
{
    "msg": "操作成功"
}
   */
  @Post('attend/position')
  @UseGuards(LoginRequired, AttendAdminPermission)
  async insertOnePosition(@Body() body: {description: string, device: string}) {
    const { description, device } = body;

    return await this.adminService.insertOnePosition(description, device);
  }

    /**
   * @api {delete} /admin/attend/position DeleteOnePosition
   * @apiName DeleteOnePosition
   * @apiGroup AttendAdmin
   * @apiPermission Logined AttendAdmin
   * @apiSuccessExample {json} Success-Response
{
    "msg": "操作已完成"
}
   */
  @Delete('attend/position/:pid')
  @UseGuards(LoginRequired, AttendAdminPermission)
  async deleteOnePosition(@Param() param: {pid: number}) {
    const { pid } = param;

    return await this.adminService.deleteOnePosition(pid);
  }

  /**
   * @api {post} /admin/attend/lecture AddOneLectue
   * @apiName AddOneLectue
   * @apiGroup AttendAdmin
   * @apiPermission Logined AttendAdmin
   * @apiSuccessExample {json} Success-Response
{
    "msg": "操作已完成"
}
   */
  @Post('attend/lecture')
  @UseGuards(LoginRequired, AttendAdminPermission)
  async addOneLecture(@Body() body: {
    title: string,
    content: string,
    positions: number[],
    start: Date,
    end: Date
  }) {
    return await this.adminService.addOneLecture(body);
  }

  /**
   * @api {delete} /admin/attend/lecture/:lid DeleteOneLectue
   * @apiName DeleteOneLectue
   * @apiGroup AttendAdmin
   * @apiPermission Logined AttendAdmin
   * @apiSuccessExample {json} Success-Response
{
    "msg": "操作已完成"
}
   */
  @Delete('attend/lecture/:lid')
  @UseGuards(LoginRequired, AttendAdminPermission)
  async deleteOneLecture(@Param() param: {lid: number}) {
    const {lid} = param;
    return await this.adminService.deleteOneLecture(lid);
  }


  /**
   * @api {put} /admin/attend/lecture/:lid UpdateOneLecture
   * @apiName UpdateOneLecture
   * @apiGroup AttendAdmin
   * @apiPermission Logined AttendAdmin
   * @apiSuccessExample {json} Success-Response
{
    "msg": "操作已完成"
}
   */
  @Put('attend/lecture/:lid')
  @UseGuards(LoginRequired, AttendAdminPermission)
  async updateOneLecture(@Param() param: {lid: number}, @Body() body: {
    title: string,
    content: string,
    positions: number[],
    start: Date,
    end: Date
  }) {
    const {lid} = param;
    return await this.adminService.updateOneLecture(lid, body);
  }

  /**
   * @api {post} /admin/attend/lecture/:lid/student/:sid/:pid AddRecordForStudent
   * @apiName AddRecordForStudent
   * @apiGroup AttendAdmin
   * @apiPermission Logined AttendAdmin
   * @apiSuccessExample {json} Success-Response
{
    "msg": "操作已完成"
}
   */
  @Post('attend/lecture/:lid/student/:sid/:pid')
  @UseGuards(LoginRequired, AttendAdminPermission)
  async addRecordForStudent(@Param() param: {lid: number, sid: number, pid:number}) {
    const {lid, sid, pid} = param;

    return await this.adminService.addRecordForStudent(lid, sid, pid);
  }

  /**
   * @api {delete} /admin/attend/:rid DeleteOneRecord
   * @apiName DeleteOneRecord
   * @apiGroup AttendAdmin
   * @apiPermission Logined AttendAdmin
   * @apiSuccessExample {json} Success-Response
{
    "msg": "操作已完成"
}
   */
  @Delete('attend/record/:rid')
  @UseGuards(LoginRequired, AttendAdminPermission)
  async deleteRecord(@Param() param: {rid: number}) {
    const { rid } = param;
    return await this.adminService.deleteRecord(rid);
  }

  /**
   * @api {post} /admin/attend/student AddOneStudent
   * @apiName AddOneStudent
   * @apiGroup AttendAdmin
   * @apiPermission Logined AttendAdmin
   * @apiSuccessExample {json} Success-Response
   * { "msg": "操作成功" }
   */
  @Post('attend/student')
  @UseGuards(LoginRequired, AttendAdminPermission)
  async addOneStudent(@Body() body: {
    username: string,
    password: string,
    name: string,
    email: string,
    teacher: number,
    student_id: string
  }) {
    if(!!body.password) {
      body.password = EndeService.decodeFromHttp(body.password);
    }

    return await this.adminService.addOneStudent(body);
  }

  /**
   * @api {delete} /admin/attend/student/:sid DeleteOneStudent
   * @apiName DeleteOneStudent
   * @apiGroup AttendAdmin
   * @apiPermission Logined AttendAdmin
   * @apiSuccessExample {json} Success-Response
{
    "msg": "操作已完成"
}
   */
  @Delete('attend/student/:sid')
  @UseGuards(LoginRequired, AttendAdminPermission)
  async deleteOneStudent(@Param() param: {sid: number}) {
    const { sid } = param;
    return await this.adminService.deleteOneStudent(sid);
  }

  /**
   * @api {put} /admin/attend/student/:sid UpdateOneStudentInfo
   * @apiName UpdateOneStudentInfo
   * @apiGroup AttendAdmin
   * @apiPermission Logined AttendAdmin
   * @apiSuccessExample {json} Success-Response
{
    "msg": "操作已完成"
}
   */
  @Put('attend/student/:sid')
  @UseGuards(LoginRequired, AttendAdminPermission)
  async updateOneStudentInfo(@Param() param: {sid: number}, @Body() body: {
    email: string,
    student_id: string,
    name: string,
  }) {
    const { sid } = param;
    return await this.adminService.updateOneStudentInfo(sid, body);
  }

  /**
   * @api {post} /admin/attend/teacher InsertOneTeacher
   * @apiName InsertOneTeacher
   * @apiGroup AttendAdmin
   * @apiPermission Logined AttendAdmin
   * @apiSuccessExample {json} Success-Response
{
    "msg": "操作已完成"
}
   */
  @Post('attend/teacher')
  @UseGuards(LoginRequired, AttendAdminPermission)
  async insertOneTeacher(@Body() body: {
    username: string,
    password: string,
    name: string,
    email: string,
    personal_page: string,
    research_area: string,
  }) {
    if(!!body.password) {
      body.password = EndeService.decodeFromHttp(body.password);
    }
    return await this.adminService.addOneTeacher(body);
  }

  /**
   * @api {delete} /admin/attend/teacher/:tid DeleteOneTeacher
   * @apiName DeleteOneTeacher
   * @apiGroup AttendAdmin
   * @apiPermission Logined AttendAdmin
   * @apiSuccessExample {json} Success-Response
{
    "msg": "操作已完成"
}
   */
  @Delete('attend/teacher/:tid')
  @UseGuards(LoginRequired, AttendAdminPermission)
  async deleteOneTeacher(@Param() param: {tid: number}) {
    const { tid } = param;
    return await this.adminService.deleteOneTeacher(tid);
  }

  /**
   * @api {put} /admin/attend/teacher/:tid UpdateOneTeacher
   * @apiName UpdateOneTeacher
   * @apiGroup AttendAdmin
   * @apiPermission Logined AttendAdmin
   * @apiSuccessExample {json} Success-Response
{
    "msg": "操作已完成"
}
   */
  @Put('attend/teacher/:tid')
  @UseGuards(LoginRequired, AttendAdminPermission)
  async updateOneTeacher(@Param() param: {tid: number}, @Body() body: {
    name: string,
    research_area: string,
    personal_page: string,
    email: string,
  }) {
    const { tid } = param;
    return await this.adminService.updateOneTeacher(tid, body);
  }

  /**
   * @api {put} /admin/attend/student/:sid/teacher/:tid UpdateTeacherForStudent
   * @apiName UpdateTeacherForStudent
   * @apiGroup AttendAdmin
   * @apiPermission Logined AttendAdmin
   * @apiSuccessExample {json} Success-Response
{
    "msg": "操作已完成"
}
   */
  @Put('attend/student/:sid/teacher/:tid')
  @UseGuards(LoginRequired, AttendAdminPermission)
  async addOrChangeTeacherForStudent(@Param() param: {sid: number, tid: number}) {
    const {sid, tid} = param;
    return await this.adminService.addOrChangeTeacherForStudent(sid, tid);
  }

  /**
   * @api {post} /admin/attend/students AddManyStudents
   * @apiName AddManyStudents
   * @apiPermission Logined AttendAdmin
   * @apiGroup AttendAdmin
   * @apiSuccessExample {json} Success-Response
{
    "msg": "操作成功",
    "affected": 1,
    "errors": [
        {
            "username": "abc",
            "password": "def",
            "name": "abc",
            "email": "email@qq.com",
            "student_id": "asdf",
            "teacher_username": "asdf",
            "err": "不存在此老师"
        },
        {
            "username": "abc",
            "password": "def",
            "name": "abc",
            "email": "email@qq.com",
            "student_id": "asdf",
            "teacher_username": "asdf",
            "err": "不存在此老师"
        },
        {
            "username": "abc",
            "password": "def",
            "name": "abc",
            "email": "email@qq.com",
            "student_id": "asdf",
            "teacher_username": "teacher",
            "err": {
                "response": {
                    "msg": "该学生已存在"
                },
                "status": 406,
                "message": "Http Exception"
            }
        }
    ]
}
   */
  @Post('attend/students')
  @UseGuards(LoginRequired, AttendAdminPermission)
  async addStudents(@Body() body: {
    username: string,
    password: string,
    name: string,
    email: string,
    student_id: string,
    teacher_username: string
  }[]) {
    for(const index in body) {
      body[index].password = EndeService.decodeFromHttp(body[index].password);
    }
    return await this.adminService.addStudents(body);
  }

  /**
   * @api {put} /admin/attend/:uid/password ChangePassword
   * @apiName ChangePassword
   * @apiPermission Logined AttendAdmin
   * @apiGroup AttendAdmin
   */
  @Put('attend/:uid/password')
  @UseGuards(LoginRequired, AttendAdminPermission)
  async changePasswordForUser(@Param() param: {uid: number}, @Body() body: {password: string}) {

    const {uid} = param;
    const password = EndeService.decodeFromHttp(body.password);
    return await this.adminService.changePassword(uid, password);

  }

  /**
   * @api {put} /admin/attend/student/:sid/password ChangePasswordForStudent
   * @apiName ChangePasswordForStudent
   * @apiPermission Logined AttendAdmin
   * @apiGroup AttendAdmin
   */
  @Put('attend/student/:sid/password')
  @UseGuards(LoginRequired, AttendAdminPermission)
  async changePasswordForStudent(@Param() param: {sid: number}, @Body() body: {password: string}) {
    const {sid} = param;
    const password = EndeService.decodeFromHttp(body.password);
    return await this.adminService.changePasswordForStudent(sid, password);
  }

  /**
   * @api {put} /admin/attend/teacher/:tid/password ChangePasswordForTeacher
   * @apiName ChangePasswordForTeacher
   * @apiPermission Logined AttendAdmin
   * @apiGroup AttendAdmin
   */
  @Put('attend/teacher/:tid/password')
  @UseGuards(LoginRequired, AttendAdminPermission)
  async changePasswordForTeacher(@Param() param: {tid: number}, @Body() body: {password: string}) {
    const {tid} = param;
    const password = EndeService.decodeFromHttp(body.password);
    return await this.adminService.changePasswordForTeacher(tid, password);
  }

  @Get('attend/query/teacher')
  @UseGuards(LoginRequired, AttendAdminPermission)
  async queryTeacherByName(@Query() query: {name: string}) {
    const { name } = query;
    return await this.adminService.queryTeacherByName(name);
  }

  @Put('attend/all/teacher/password')
  @UseGuards(LoginRequired, AttendAdminPermission)
  async resetAllTeachersPassword(@Body() body: {
    password: string
  }) {
    const { password } = body;
    return await this.adminService.resetAllPasswordForTeachers(password)
  }

// for bichoice:

  /**
   * @api {get} /admin/bichoice/settings GetSettings
   * @apiName GetSettings
   * @apiGroup BiChoiceAdmin
   * @apiPermission Logined BiChoiceAdmin
   * @apiSuccessExample {json} Success-Response
   * [
   *  {
   *    "key": "setting_key",
   *    "value": "setting_val, may be string, array, or number",
   *    "lastUpdateTime": "2020-09-01 11:15:00",
   *    "lastUpdateAdmin": {
   *      "name": "adminname",
   *      "type": "admintype"
   *    }
   *  }
   * ]
   */
  @Get('bichoice/settings')
  @UseGuards(LoginRequired, BiChoiceAdminPermission)
  async biChoiceGetSettings() {
    return await this.adminService.getSettings();
  }

  /**
   * @api {get} /admin/bichoice/setting UpdateOrInsertSetting
   * @apiName UpdateOrInsertSetting
   * @apiGroup BiChoiceAdmin
   * @apiPermission Logined BiChoiceAdmin
   */
  @Put('bichoice/setting')
  @UseGuards(LoginRequired, BiChoiceAdminPermission)
  async bichoiceUpdateOrInsertSetting(@Req() req, @Body() body: {key: string, value: string}) {
    const id = req.user.admin.id;
    const {key, value} = body;
    return await this.adminService.updateOrInsertSetting(id, key, value);
  }

  /**
   * @api {get} /admin/bichoice/enrols GetEnrols
   * @apiName GetEnrols
   * @apiGroup BiChoiceAdmin
   * @apiPermission Logined BiChoiceAdmin
   * @apiSuccessExample {json} Success-Response
    [
      {
          "id": 1,
          "description": "enrol"
      },
      {
          "id": 2,
          "description": "enrol2"
      }
    ]
   */
  @Get('bichoice/enrols')
  @UseGuards(LoginRequired, BiChoiceAdminPermission)
  async getEnrols() {
    return await this.adminService.getEnrols();
  }

  /**
   * @api {post} /admin/bichoice/enrol AddNewEnrol
   * @apiName AddNewEnrol
   * @apiGroup BiChoiceAdmin
   * @apiPermission Logined BiChoiceAdmin
   * @apiSuccessExample {json} Success-Response
    {
      "msg": "操作成功",
      "id": 3,
      "description": "enrol3"
    }
   */
  @Post('bichoice/enrol')
  @UseGuards(LoginRequired, BiChoiceAdminPermission)
  async addNewEnrols(@Body() body: {description: string}) {
    return await this.adminService.addNewEnrols(body.description);
  }

  /**
   * @api {put} /admin/bichoice/enrol/:id ChangeEnrolDescription
   * @apiName ChangeEnrolDescription
   * @apiGroup BiChoiceAdmin
   * @apiPermission Logined BiChoiceAdmin
   * @apiSuccessExample {json} Success-Response
    {
      "msg": "操作成功",
      "id": 3,
      "description": "enrol3"
    }
   */
  @Put('bichoice/enrol/:id')
  @UseGuards(LoginRequired, BiChoiceAdminPermission)
  async changeEnrolDescription(@Param() param: {id: string}, @Body() body: {description: string}) {
    const eid = parseInt(param.id);
    const description = body.description;

    return await this.adminService.changeEnrolDescription(eid, description);
  }
   
  /**
   * @api {delete} /admin/bichoice/enrol/:id DeleteOneEnrol
   * @apiName DeleteOneEnrol
   * @apiGroup BiChoiceAdmin
   * @apiPermission Logined BiChoiceAdmin
   * @apiSuccessExample {json} Success-Response
    {
      "msg": "操作成功"
    }
   */
  @Delete('bichoice/enrol/:id')
  @UseGuards(LoginRequired, BiChoiceAdminPermission)
  async deleteEnrol(@Param() param: {id: string}) {
    const id = parseInt(param.id);
    return await this.adminService.deleteEnrol(id);
  }

  /**
   * @api {get} /admin/bichoice/degrees GetDegrees
   * @apiName GetDegrees
   * @apiGroup BiChoiceAdmin
   * @apiPermission Logined BiChoiceAdmin
   * @apiSuccessExample {json} Success-Response
    [
      "degree_id": 1,
      "degree_description": "",
      "enrol_id": 5,
      "enrol_description": ""
    ]
   */
  @Get('bichoice/degrees')
  @UseGuards(LoginRequired, BiChoiceAdminPermission)
  async getDegrees() {
    return await this.adminService.getDegrees();
  }

  /**
   * @api {post} /admin/bichoice/degree AddNewDegree
   * @apiName AddNewDegree
   * @apiGroup BiChoiceAdmin
   * @apiPermission Logined BiChoiceAdmin
   * @apiSuccessExample {json} Success-Response
    [
      "degree_id": 1,
      "degree_description": "",
      "enrol_id": 5,
      "enrol_description": ""
    ]
   */
  @Post('bichoice/degree')
  @UseGuards(LoginRequired, BiChoiceAdminPermission)
  async addNewDegree(@Body() body: {
    description: string,
    enrol_id: number
  }) {
    return await this.adminService.addNewDegree(body.description, body.enrol_id);
  }

  /**
   * @api {put} /admin/bichoice/degree/:id ChangeDegreeDescription
   * @apiName ChangeDegreeDescription
   * @apiGroup BiChoiceAdmin
   * @apiPermission Logined BiChoiceAdmin
   * @apiSuccessExample {json} Success-Response
    [
      "degree_id": 1,
      "degree_description": "",
      "enrol_id": 5,
      "enrol_description": ""
    ]
   */
  @Put('bichoice/degree/:id')
  @UseGuards(LoginRequired, BiChoiceAdminPermission)
  async changeDegreeDescription(@Param() param: {id: string}, @Body() body: {description: string}) {
    const id = parseInt(param.id);
    return await this.adminService.changeDegreeDescription(id, body.description);
  }

  /**
   * @api {delete} /admin/bichoice/degree/:id DeleteDegree
   * @apiName DeleteDegree
   * @apiGroup BiChoiceAdmin
   * @apiPermission Logined BiChoiceAdmin
   * @apiSuccessExample {json} Success-Response
    [
      "degree_id": 1,
      "degree_description": "",
      "enrol_id": 5,
      "enrol_description": ""
    ]
   */
  @Delete('bichoice/degree/:id')
  @UseGuards(LoginRequired, BiChoiceAdminPermission)
  async deleteDegree(@Param() param: {id: number}) {
    return await this.adminService.deleteDegree(param.id);
  }

  /**
   * @api {get} /admin/bichoice/sources GetSources
   * @apiName GetSources
   * @apiGroup BiChoiceAdmin
   * @apiPermission Logined BiChoiceAdmin
   * @apiSuccessExample {json} Success-Response
    [
      {"id": 1, "description": "a"}
    ]
   */
  @Get('bichoice/sources')
  @UseGuards(LoginRequired, BiChoiceAdminPermission)
  async getSources() {
    return await this.adminService.getSources();
  }

  /**
   * @api {post} /admin/bichoice/source AddNewSource
   * @apiName AddNewSource
   * @apiGroup BiChoiceAdmin
   * @apiPermission Logined BiChoiceAdmin
   * @apiSuccessExample {json} Success-Response
    {
      "msg": "添加成功"
    }
   */
  @Post('bichoice/source')
  @UseGuards(LoginRequired, BiChoiceAdminPermission)
  async addNewSource(@Body() body) {
    return await this.adminService.addNewSource(body);
  }

  /**
   * @api {put} /admin/bichoice/source/:id ChangeSourceDescription
   * @apiName ChangeSourceDescription
   * @apiGroup BiChoiceAdmin
   * @apiPermission Logined BiChoiceAdmin
   * @apiSuccessExample {json} Success-Response
    {
      "msg": "修改成功"
    }
   */
  @Put('bichoice/source/:id')
  @UseGuards(LoginRequired, BiChoiceAdminPermission)
  async changeSourceDescription(@Param() param: {id: string}, @Body() body) {
    const id = parseInt(param.id);
    return await this.adminService.changeSourceDescription(id, body.description);
  }

  /**
   * @api {delete} /admin/bichoice/source/:id DeleteOneSource
   * @apiName DeleteOneSource
   * @apiGroup BiChoiceAdmin
   * @apiPermission Logined BiChoiceAdmin
   * @apiSuccessExample {json} Success-Response
    {
      "msg": "删除成功"
    }
   */
  @Delete('bichoice/source/:id')
  @UseGuards(LoginRequired, BiChoiceAdminPermission)
  async deleteSource(@Param() param: {id: string}) {
    const id = parseInt(param.id);
    return await this.adminService.deleteSource(id);
  }

  /**
   * @api {get} /admin/bichoice/bistudents GetAllBistudents
   * @apiName GetAllBistudents
   * @apiGroup BiChoiceAdmin
   * @apiPermission Logined BiChoiceAdmin
   * @apiSuccessExample {json} Success-Response
    [
      {}
    ]
   */
  @Get('bichoice/bistudents')
  @UseGuards(LoginRequired, BiChoiceAdminPermission)
  async getAllBistudents() {
    return await this.adminService.getAllBistudents();
  }

  /**
   * @api {post} /admin/bichoice/bistudent AddNewBistudent
   * @apiName AddNewBistudent
   * @apiGroup BiChoiceAdmin
   * @apiPermission Logined BiChoiceAdmin
   * @apiSuccessExample {json} Success-Response
    {
      "msg": "操作成功",
      "id": 1
    }
   */
  @Post('bichoice/bistudent')
  @UseGuards(LoginRequired, BiChoiceAdminPermission)
  async addNewBistudent(@Body() body: {
    username: string,
    password: string,
    name: string,
    recommended: number,
    score: number,
    graduation_university: string,
    graduation_major: string,
    household_register: string,
    ethnic: string,
    phone: string,
    gender: string,
    email: string
    source: number,
    degree: number,
  }) {
    body.password = EndeService.decodeFromHttp(body.password);
    return await this.adminService.addNewBistudent(body);
  }

  /**
   * @api {post} /admin/bichoice/bistudents AddNewBistudents
   * @apiName AddNewBistudents
   * @apiGroup BiChoiceAdmin
   * @apiPermission Logined BiChoiceAdmin
   * @apiSuccessExample {json} Success-Response
    {
      "msg": "操作成功",
      "success": 12,
      "error": [
        {}
      ]
    }
   */
  @Post('bichoice/bistudents')
  @UseGuards(LoginRequired, BiChoiceAdminPermission)
  async addNewBistudents(@Body() body: {
    username: string,
    password: string,
    name: string,
    recommended: number,
    score: number,
    graduation_university: string,
    graduation_major: string,
    household_register: string,
    ethnic: string,
    phone: string,
    gender: string,
    email: string
    source: number,
    degree: number,
  }[]) {
    for(const index in body) {
      body[index].password = EndeService.decodeFromHttp(body[index].password);
    }

    return await this.adminService.addNewBistudents(body);
  }

  /**
   * @api {put} /admin/bichoice/bistudent/:id ChangeBistudentInfo
   * @apiName ChangeBistudentInfo
   * @apiGroup BiChoiceAdmin
   * @apiPermission Logined BiChoiceAdmin
   * @apiSuccessExample {json} Success-Response
    {
      "msg": "修改成功",
      "bistudent": {}
    }
   */
  @Put('bichoice/bistudent/:id')
  @UseGuards(LoginRequired, BiChoiceAdminPermission)
  async changeBistudentInfo(@Param() param: {id: number}, @Body() body: {
    name: string,
    recommended: number,
    score: number,
    graduation_university: string,
    graduation_major: string,
    household_register: string,
    ethnic: string,
    phone: string,
    gender: string,
    email: string
    source: number,
    degree: number,
  }) {
    return await this.adminService.changeBistudentInfo(param.id, body);
  }

  @Delete('bichoice/bistudent/:id')
  @UseGuards(LoginRequired, BiChoiceAdminPermission)
  async deleteBistudent(@Param() param: {id: number}) {
    return await this.adminService.deleteBistudent(param.id);
  }

  /**
   * @api {get} /admin/bichoice/bistudent/:id/teachers GetBistudentCanSelectTeachers
   * @apiName GetBistudentCanSelectTeachers
   * @apiGroup BiChoiceAdmin
   * @apiPermission Logined BiChoiceAdmin
   * @apiSuccessExample {json} Success-Response
    {
      "msg": "修改成功",
      "bistudent": {}
    }
   */
  @Get('bichoice/bistudent/:id/teachers')
  @UseGuards(LoginRequired, BiChoiceAdminPermission)
  async getBistudentCanSelectTeachers(@Param() param: {id: number}) {
    return await this.adminService.getBistudentCanSelectTeachers(param.id);
  }

  /**
   * @api {get} /admin/bichoice/bistudent/:id/teachers/selected GetBistudentSelectedTeachers
   * @apiName GetBistudentSelectedTeachers
   * @apiGroup BiChoiceAdmin
   * @apiPermission Logined BiChoiceAdmin
   * @apiSuccessExample {json} Success-Response
    [1,2,3]
   */
  @Get('bichoice/bistudent/:id/teachers/selected')
  @UseGuards(LoginRequired, BiChoiceAdminPermission)
  async getBistudentSelectedTechers(@Param() param: {id: number}) {
    return await this.adminService.getBistudentSelectedTeachers(param.id);
  }

  /**
   * @api {put} /admin/bichoice/bistudent/:id/teacher/:tid SelectTeacherForStudent
   * @apiName SelectTeacherForStudent
   * @apiGroup BiChoiceAdmin
   * @apiPermission Logined BiChoiceAdmin
   * @apiSuccessExample {json} Success-Response
    {
      "msg": "选择成功"
    }
   */
  @Put('bichoice/bistudent/:bisid/teacher/:tid')
  @UseGuards(LoginRequired, BiChoiceAdminPermission, BistudentCanSelect)
  async selectTeacherForStudent(@Param() param: {bisid: string, tid: string}) {
    const bisid = parseInt(param.bisid);
    const tid = parseInt(param.tid);
    return await this.adminService.selectTeacherForBistudent(bisid, tid);
  }

  /**
   * @api {delete} /admin/bichoice/bistudent/:id/teacher/:tid DeleteTeacherForStudent
   * @apiName DeleteTeacherForStudent
   * @apiGroup BiChoiceAdmin
   * @apiPermission Logined BiChoiceAdmin
   * @apiSuccessExample {json} Success-Response
    {
      "msg": "取消选择成功"
    }
   */
  @Delete('bichoice/bistudent/:bisid/teacher/:tid')
  @UseGuards(LoginRequired, BiChoiceAdminPermission, BistudentCanSelect)
  async deleteTeacherForStudent(@Param() param: {bisid: string, tid: string}) {
    const bisid = parseInt(param.bisid);
    const tid = parseInt(param.tid);
    return await this.adminService.deleteTeacherForBistudent(bisid, tid);
  }

  /**
   * @api {get} /admin/bichoice/bistudent/:id/files GetBistudentFileList
   * @apiName GetBistudentFileList
   * @apiGroup BiChoiceAdmin
   * @apiPermission Logined BiChoiceAdmin
   * @apiSuccessExample {json} Success-Response
    [
      {
        "filename": "asd",
        "fid": 1
      }
    ]
   */
  @Get('bichoice/bistudent/:bisid/files')
  @UseGuards(LoginRequired, BiChoiceAdminPermission)
  async getBistudentFileList(@Param() param: {bisid: string}) {
    const bisid = parseInt(param.bisid);
    return await this.adminService.getBistudentFileList(bisid);
  }

  /**
   * @api {get} /admin/bichoice/file/:fid GetFile
   * @apiName GetFile
   * @apiGroup BiChoiceAdmin
   * @apiPermission Logined BiChoiceAdmin
   */
  @Get('bichoice/file/:fid')
  @UseGuards(LoginRequired, BiChoiceAdminPermission)
  async getBistudentFile(@Param() param: {fid: string}, @Res() response) {
    const fid = parseInt(param.fid);
    const content = await this.adminService.getBistudentFile(fid);
    response.end(Buffer.from(content));
  }

  /**
   * @api {delete} /admin/bichoice/file/:fid DeleteFile
   * @apiName DeleteFile
   * @apiGroup BiChoiceAdmin
   * @apiPermission Logined BiChoiceAdmin
   * @apiSuccessExample {json} Success-Response
    {
      "msg": "删除成功"
    }
   */
  @Delete('bichoice/file/:fid')
  @UseGuards(LoginRequired, BiChoiceAdminPermission)
  async deleteBistudentFile(@Param() param: {fid: string}) {
    const fid = parseInt(param.fid);
    return await this.adminService.deleteBistudentFile(fid);
  }

  @Get('bichoice/teachers')
  @UseGuards(LoginRequired, BiChoiceAdminPermission)
  async getAllBiTeachers() {
    return await this.adminService.getAllBiTeachers();
  }

  @Get('bichoice/teacher/:id')
  @UseGuards(LoginRequired, BiChoiceAdminPermission)
  async getOneBiTeacher(@Param() param: {id: string}) {
    const id = parseInt(param.id);
    return await this.adminService.getOneBiTeacher(id);
  }

  @Get('bichoice/teacher/:id/students')
  @UseGuards(LoginRequired, BiChoiceAdminPermission)
  async getStudentsOfTeachers(@Param() param: {id: string}) {
    const id = parseInt(param.id);
    return await this.adminService.getStudentsOfTeachers(id);
  }

  @Get('bichoice/teacher/:id/enrols')
  @UseGuards(LoginRequired, BiChoiceAdminPermission)
  async getTeacherEnrols(@Param() param: {id: string}) {
    const id = parseInt(param.id);
    return await this.adminService.getTeacherEnrols(id);
  }

  @Get('bichoice/teacher/:id/degrees')
  @UseGuards(LoginRequired, BiChoiceAdminPermission)
  async getTeacherDegrees(@Param() param: {id: string}) {
    const id = parseInt(param.id);
    return await this.adminService.getTeacherDegrees(id);
  }
}
