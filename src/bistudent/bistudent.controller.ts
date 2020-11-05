import { Controller, Get, UseGuards } from '@nestjs/common';
import { LoginRequired } from 'src/user/user.guard';
import { BistudentPermission } from './bistudent.guard';

@Controller('bistudent')
export class BistudentController {
  @Get('info')
  @UseGuards(LoginRequired, BistudentPermission)
  async getInfo() {
    return;
  }
}
