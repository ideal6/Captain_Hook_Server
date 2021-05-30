import { WebhookField } from '../entities/webhook-field.entity';
import { WebhookType } from '../entities/webhook.entity';

export class CreateWebhookDto {
  name: string;
  type: WebhookType;
  fields: { name: string; description: string; field: string }[];
}
