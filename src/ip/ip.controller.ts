import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { getIp } from 'src/util/global.funtions';

@Controller('ip')
export class IpController {
  @Get('')
  getClientIp(@Req() request: Request) {
    const ip = getIp(request);
    console.log(ip)
    return ip;
  }
}
