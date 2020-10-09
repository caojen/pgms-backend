import { Controller, Get, Query, Req, HttpException, UseGuards, Param } from '@nestjs/common';
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
}
