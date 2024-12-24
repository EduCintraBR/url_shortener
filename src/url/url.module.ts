import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';

@Module({
    imports: [],
    controllers: [UrlController],
    providers: [],
})
export class UrlModule {}