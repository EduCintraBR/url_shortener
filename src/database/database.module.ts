import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisService } from './redis.service';
import { RedisOptions } from 'src/config/app-options.constants';

@Module({
  imports: [
    CacheModule.registerAsync(RedisOptions),
    MongooseModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
            uri: configService.get<string>('MONGO_URI'), 
        }),
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class DatabaseModule {}