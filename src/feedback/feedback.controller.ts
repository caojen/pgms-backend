import { Body, Controller, HttpException, Post, Req, UseFilters, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { FeedbackLimit } from './feedback.guard';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {

  constructor(
    private readonly feedbackService: FeedbackService
  ) {}

  @Post('forget-password')
  @UseGuards(FeedbackLimit)
  async forgetPassword(@Req() request: Request, @Body() body) {
    const ip = request['x-ip'];
    if (!body) {
      throw new HttpException({
        msg: '没有收到有效数据'
      }, 406);
    }
    return await this.feedbackService.forgetPassword(ip, body);
  }
}
