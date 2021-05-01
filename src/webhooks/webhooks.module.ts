import { Module } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { WebhooksController } from './webhooks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Webhook } from './entities/webhook.entity';
import { WebhookHistory } from './entities/webhook-history.entity';
import { WebhookField } from './entities/webhook-field.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Webhook, WebhookHistory, WebhookField])],
  providers: [WebhooksService],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
