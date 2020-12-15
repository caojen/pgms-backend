import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserService } from "./user.service";
import { Request } from 'express';

function getCookies(request: Request, key: string) {
  const cookies = {};
  request.headers?.cookie?.split(';')?.forEach(cookie => {
    const parts = cookie.match(/(.*?)=(.*)$/)
    cookies[ parts[1].trim() ] = (parts[2] || '').trim();
  });
  return cookies[key];
}

@Injectable()
export class LoginRequired implements CanActivate {

  constructor(
    private readonly userService: UserService
  ) {}

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = getCookies(request, 'token');
    const uid = await this.userService.getUidByToken(token);
    if(uid === null) {
      return false;
    } else {
      const userInfo = await this.userService.getUserBasicInfo(uid);
      request['user'] = userInfo;
      return true;
    }
  }
}
