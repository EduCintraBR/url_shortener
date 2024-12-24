import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: CacheStore) {}

  async saveInCache(key: string, value: any) {
    await this.cacheManager.set(key, value);
  }

  async getFromCache(key: string) {
    return this.cacheManager.get(key);
  }
}