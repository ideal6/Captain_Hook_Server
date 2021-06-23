import { OmitType, PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { CreateFieldDto } from './create-field.dto';
import { CreateWebhookDto } from './create-webhook.dto';
import { UpdateFieldDto } from './update-field.dto';

export class UpdateWebhookDto extends OmitType(PartialType(CreateWebhookDto), [
  'fields',
] as const) {
  @IsNotEmpty()
  @IsNumber()
  id: number;
  @IsArray()
  fields: (CreateFieldDto | UpdateFieldDto)[];
}
