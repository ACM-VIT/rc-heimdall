import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as fs from 'fs';

@Injectable()
export class AdminService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async updateRound(round: number) {
    await this.cacheManager.set('round', round);
    fs.writeFileSync('./config/round.txt', String(round));
    return 'Status updated successfully';
  }
}
