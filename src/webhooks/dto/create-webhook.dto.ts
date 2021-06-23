import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { WebhookField } from '../entities/webhook-field.entity';
import { WebhookType } from '../entities/webhook.entity';
import { CreateFieldDto } from './create-field.dto';

export class CreateWebhookDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsEnum(WebhookType)
  type: WebhookType;
  @IsNotEmpty()
  @IsArray()
  fields: CreateFieldDto[];
}
