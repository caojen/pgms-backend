import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

@Injectable()
export class BistudentPermission implements CanActivate {
  canActivate(
    context: ExecutionContext
  ) {
    const request = context.switchToHttp().getRequest();
    return !!request?.user?.bistudent;
  }
}
