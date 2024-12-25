import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema()
export class ShortUrl extends Document {
  @Prop({ required: true })
  shortCode: string;

  @Prop({ required: true })
  originalUrl: string;

  @Prop({ default: Date.now })
  createdAt: string;

  @Prop({ required: true })
  expiredAt: Date;
}

export const ShortUrlSchema = SchemaFactory.createForClass(ShortUrl);