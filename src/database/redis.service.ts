import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: CacheStore) {}

  async saveInCache(key: string, value: any, ttl?: number) {
    await this.cacheManager.set(key, value, { ttl });
  }

  async getFromCache(key: string): Promise<string>{
    return this.cacheManager.get(key);
  }
}