import { CanActivate, ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { getConfigs } from "src/util/global.funtions";

@Injectable()
export class TeacherPermission implements CanActivate {
  canActivate(
    context: ExecutionContext
  ) {
    const request = context.switchToHttp().getRequest();
    return !!request?.user?.teacher;
  }
}

@Injectable()
export class TeacherCanSelect implements CanActivate {
  async canActivate() {
    /*
    stage_count: number; 表示双选时总共的阶段数(这也是学生可以选择的老师总数)
    current_stage: number; 表示当前的阶段数. 当值为-1时代表未开始, 当值为0是代表学生选择阶段(1,2,3...等代表老师选择阶段) 当值大于stage_count时代表已结束
    begin_time: string; 一个可以格式化为date的字符串, 代表当前阶段开始时间
    end_time: string; 一个可以格式化为date的字符串, 代表当前阶段的结束时间 // 当当前时间位于两个时间之间时, 代表某个身份可以选择
    
    */
    const now = new Date(Date.now());
    const config = await getConfigs(["stage_count", "current_stage", "begin_time", "end_time"]);
    if(config.current_stage.value > 0 &&
        config.current_stage.value <= config.stage_count.value) {
      const begin_time = new Date(config.begin_time.value);
      const end_time = new Date(config.end_time.value);
      if(now >= begin_time && now <= end_time) {
        return true;
      }
    }

    throw new HttpException({
      msg: '当前不在选择阶段中'
    }, 403);
  }
}