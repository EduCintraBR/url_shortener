import { v4 as uuidv4 } from 'uuid';
import { ConflictException, Injectable } from '@nestjs/common';
import { RedisService } from 'src/database/redis.service';
import { InjectModel } from '@nestjs/mongoose';
import { ShortUrl } from 'src/database/schemas/shortUrl.schema';
import { Model } from 'mongoose';

@Injectable()
export class UrlService {
    constructor(private readonly redisService: RedisService, @InjectModel(ShortUrl.name) private shortUrlModel: Model<ShortUrl>) {}

    async generateAndSaveShortUrl(url: string): Promise<string> {
        // Verificando se a URL ja foi encurtada
        const shortUrl = await this.getShortUrl(url);
        if (shortUrl) {
            throw new ConflictException('URL already shortened');
        }
        
        // Gerando um shortCode
        const shortCode = this.generateShortCode();

        // Salvando a URL encurtada no MongoDB e Redis
        await this.saveShortUrl(shortCode, url);
        
        // Retornando a URL encurtada
        return `${process.env.SHORT_DOMAIN}/${shortCode}`;
    }

    async getOriginalUrl(shortCode: string): Promise<string> {
        // Pegando a URL original do Redis
        const originalUrl = await this.redisService.getFromCache(shortCode);

        // Se a URL original nao existir no Redis, procura no MongoDB
        if (!originalUrl) {
            const shortUrl = await this.shortUrlModel.findOne({ shortCode });
            if (shortUrl && new Date() < shortUrl.expiredAt) {
                await this.redisService.saveInCache(shortCode, shortUrl.originalUrl);
                return shortUrl.originalUrl;
            }
        } else {
            return originalUrl;
        }
    }

    private async saveShortUrl(shortCode: string, originalUrl: string): Promise<void> {
        // Pegando das variaveis de ambiente o tempo de expiracao da URL encurtada
        const TIME_TO_EXPIRE = parseInt(process.env.TIME_TO_EXPIRE) * 60 * 1000;

        // Assimilando as propriedades do objeto
        const shortUrlData = {
            shortCode,
            originalUrl,
            createdAt: new Date().toISOString(),
            expiredAt: new Date(new Date().getTime() + TIME_TO_EXPIRE),
        };

        // Salvando a URL encurtada no MongoDB
        const shortUrl = new this.shortUrlModel(shortUrlData);
        await shortUrl.save();

        // Salvando a URL original no Redis 
        await this.redisService.saveInCache(shortCode, originalUrl, TIME_TO_EXPIRE);
        // Salvando a URL encurtada no Redis
        await this.redisService.saveInCache(originalUrl, shortCode, TIME_TO_EXPIRE);
    }

    private async getShortUrl(originalUrl: string): Promise<string> {
        // Pegando a URL encurtada do Redis
        const shortCode = await this.redisService.getFromCache(originalUrl);

        // Se a URL encurtada nao existir no Redis, procura no MongoDB e verifica se a URL existente esta expirada
        if (!shortCode) {
            const shortUrl = await this.shortUrlModel.findOne({ originalUrl });
            if (shortUrl && new Date() < shortUrl.expiredAt) {
                await this.redisService.saveInCache(shortUrl.shortCode, originalUrl);
                return shortUrl.shortCode;
            }
        } else {
            return shortCode;
        }
    }

    private generateShortCode(): string {
        // Gerando um UUID
        const randomId = uuidv4();

        // Removendo os hifens e pegando os 8 primeiros caracteres
        const hexString = randomId.replaceAll(/-/g, '').slice(0, 8);

        // Convertendo de hexadecimal para decimal
        const decimalValue = parseInt(hexString, 16);

        // Convertendo de decimal para base62
        const id = this.convertToBase62(decimalValue);
        return id;
    }

    private convertToBase62(decimalValue: number): string {
        const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        if (decimalValue === 0) return '0';
        let result = '';
        while (decimalValue > 0) {
            const remainder = decimalValue % 62;
            result = ALPHABET[remainder % 62] + result;
            decimalValue = Math.floor(decimalValue / 62);
        }
        return result;
    }
}