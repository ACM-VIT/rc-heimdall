import {
  Injectable,
  CanActivate,
  Inject,
  CACHE_MANAGER,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Cache } from 'cache-manager';

@Injectable()
export class Round2Guard implements CanActivate {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return this.validateStatus(context.switchToHttp().getRequest());
  }

  async validateStatus(request) {
    const round = await this.cacheManager.get('round');
    const qualifiedTeamIds = <number[]>await this.cacheManager.get('qualifiedTeams');
    if (round > 1 && qualifiedTeamIds.includes(request.user.teamId)) {
      return true;
    }
    throw new UnauthorizedException(`Team not qualified!`);
    return;
  }
}
