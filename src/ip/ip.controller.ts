import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { getIp } from 'src/util/global.funtions';

@Controller('ip')
export class IpController {
  @Get('')
  async getClientIp(@Req() request: Request) {
    return getIp(request)
  }
}
