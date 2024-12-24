import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/database/redis.service';

@Injectable()
export class UrlService {
    constructor(private readonly redisService: RedisService) {
        
    }
}