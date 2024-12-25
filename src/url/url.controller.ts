import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { UrlService } from "./url.service";


@Controller()
export class UrlController {
    constructor(private urlService: UrlService) {}

    @Post("/shorten")
    async shortenUrl(@Body() { fullUrl }: { fullUrl: string }) {
        const urlShortened = await this.urlService.generateAndSaveShortUrl(fullUrl);
        return { urlShortened };
    }

    @Get(":shortCode")
    async redirectToOriginalUrl(@Param("shortCode") shortCode: string) {
        return this.urlService.getOriginalUrl(shortCode);
    }
}