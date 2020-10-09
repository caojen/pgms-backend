import { Controller, Get, Query, Req, HttpException, UseGuards, Param, Put, Body, Post, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginRequired } from 'src/user/user.guard';
import { AttendAdminPermission } from './admin.guard';

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
    offset: number
  }) {
    const pageSize = query.pageSize;
    const offset = query.offset;

    if(isNaN(pageSize) || isNaN(offset)) {
      throw new HttpException({
        msg: '参数错误'
      }, 406);
    }
    return await this.adminService.getAllAttendStudents(pageSize, offset);
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

}
