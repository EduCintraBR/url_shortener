import { Module } from '@nestjs/common';
import { UrlModule } from './url/url.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`Carregando arquivo: .env.${process.env.NODE_ENV || 'development'}`);
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
    }),
    UrlModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
