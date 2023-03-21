import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as config from 'config';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor() {}

  readonly admins = <string[]>config.get('admins');
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.admins.includes(request.user.id);
  }
}
