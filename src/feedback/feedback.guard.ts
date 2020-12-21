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
    const request = context.switchToHttp().getRequest();
    const ip = getIp(request);
    request['x-ip'] = ip;
    if(ip) {
      const sql = `
        SELECT count(1) as count
        FROM feedback
        WHERE identify=?
          AND timestampdiff(minute, create_time, now()) < ${FeedbackLimit.ptime}
      `;
      const res = (await this.queryDb.queryDb(sql, [ip]))[0].count;
      return res < FeedbackLimit.tries;
    } else {
      return false;
    }
  }
}
