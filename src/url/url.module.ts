import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UrlService } from './url.service';

@Module({
    imports: [DatabaseModule],
    controllers: [UrlController],
    providers: [UrlService],
})
export class UrlModule {}