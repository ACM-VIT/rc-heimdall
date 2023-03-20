import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as fs from 'fs';

@Injectable()
export class AdminService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async updateStatus(round: number) {
    await this.cacheManager.set('round', round);
    fs.writeFileSync('./config/status.txt', String(round));
    return 'Status updated successfully';
  }
}
