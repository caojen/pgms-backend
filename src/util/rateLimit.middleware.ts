// rateLimit中间件

import { Request, Response } from "express";
import { HttpException, Logger } from '@nestjs/common'
import { getIp } from "./global.funtions";

// 每60秒最多请求1000次
const requests = 1000;
const sec = 60;

const logger = new Logger('RateLimit')
const cli = {}

export function rateLimit(req: Request, res: Response, next: any) {
  const ip = getIp(req);

  if(cli[ip] === undefined) {
    cli[ip] = []
  }
  const now = new Date()
  const limit = new Date(now.getTime() - sec * 1000);

  // 首先去除cli[ip]超时部分
  const length = cli[ip].length;
  let index = -1;
  for(let i = 0; i < length; i++) {
    if(cli[ip][i] >= limit) {
      index = i;
      break;
    }
  }
  if(index !== -1) {
    cli[ip] = cli[ip].slice(index)
  }
  // 删除后，将当前时间加入到cli[ip]中
  cli[ip].push(now)
  // 判断是否超过了限制：
  if(cli[ip].length > requests) {
    logger.error(`Limited ip ${ip} with requests ${cli[ip].length}`);
    throw new HttpException({
      msg: '请求频率太多，请稍后重试'
    }, 429);
  } else {
    next()
  }
}
