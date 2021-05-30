import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateWebhookDto } from './create-webhook.dto';

export class UpdateWebhookDto extends PartialType(
  OmitType(CreateWebhookDto, ['fields'] as const),
) {
  fields: { id: number; name: string; description: string; field: string }[];
}
