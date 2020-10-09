import { Controller, Get, Query, Req, HttpException, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginRequired } from 'src/user/user.guard';
import { AttendAdminPermission } from './admin.guard';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService
  ) {}

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
}
