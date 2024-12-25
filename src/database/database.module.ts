import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisService } from './redis.service';
import { RedisOptions } from 'src/config/app-options.constants';
import { ShortUrl, ShortUrlSchema } from './schemas/shortUrl.schema';

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
    MongooseModule.forFeature([{ name: ShortUrl.name, schema: ShortUrlSchema }]),
  ],
  providers: [RedisService],
  exports: [RedisService, MongooseModule],
})
export class DatabaseModule {}