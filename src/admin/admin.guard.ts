import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

@Injectable()
export class AttendAdminPermission implements CanActivate {
  canActivate(
    context: ExecutionContext
  ) {
    const request = context.switchToHttp().getRequest();
    return request?.user?.admin?.type === 'attend' || request?.user?.admin?.type === 'admin'; 
  }
}

@Injectable()
export class BiChoiceAdminPermission implements CanActivate {
  canActivate(
    context: ExecutionContext
  ) {
    const request = context.switchToHttp().getRequest();
    return request?.user?.admin?.type === 'bichoice' || request?.user?.admin?.type === 'admin'; 
  }
}
