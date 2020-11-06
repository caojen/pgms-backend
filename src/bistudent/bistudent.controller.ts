import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { LoginRequired } from 'src/user/user.guard';
import { BistudentPermission } from './bistudent.guard';
import { BistudentService } from './bistudent.service';

@Controller('bistudent')
export class BistudentController {

  constructor(
    private readonly bistudentService: BistudentService
  ) {}

  @Get('info')
  @UseGuards(LoginRequired, BistudentPermission)
  async getInfo(@Req() request) {
    return request.user.bistudent;
  }

  @Put('info')
  @UseGuards(LoginRequired, BistudentPermission)
  async updateInfo(@Req() request, @Body() body: {
    phone: string,
    email: string,
  }) {
    return await this.bistudentService.updateInfo(request.user.bistudent.id, body);
  }
}
