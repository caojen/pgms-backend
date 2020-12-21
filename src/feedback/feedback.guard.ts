import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { QueryDbService } from "src/query-db/query-db.service";
import { getIp } from "src/util/global.funtions";

// 对于未登录用户的请求次数限制
@Injectable()
export class FeedbackLimit implements CanActivate {
  constructor(
    private readonly queryDb: QueryDbService
  ) {}

  // 每ptime(分钟)允许tries请求次数
  private static readonly ptime = 10;
  private static readonly tries = 10;

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    // 设定限制频率
    // 得到当前ip：
    console.log('feedbacklimit')
    const request = context.switchToHttp().getRequest();
    const ip = getIp(request);
    request['ip'] = ip;
    console.log('feedbacklimit')
    console.log(ip)
    if(ip) {
      const sql = `
        SELECT count(1) as count
        FROM feedback
        WHERE identify=?
          AND timestampdiff(minute, create_time, now()) < ${FeedbackLimit.ptime}
      `;
      console.log('in ip')
      const res = (await this.queryDb.queryDb(sql, [ip]))[0].count;
      console.log(res)
      return res < FeedbackLimit.tries;
    } else {
      console.log('return false')
      return false;
    }
  }
}
