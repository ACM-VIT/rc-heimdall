import { Injectable, CanActivate, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Cache } from 'cache-manager';

@Injectable()
export class DisableAfterRound1Guard implements CanActivate {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  canActivate(): boolean | Promise<boolean> | Observable<boolean> {
    return this.validateStatus();
  }

  async validateStatus() {
    return (await this.cacheManager.get('round')) == 1;
  }
}
