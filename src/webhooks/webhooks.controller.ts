import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { Webhook } from './entities/webhook.entity';
import { WebhooksService } from './webhooks.service';
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Get('/uniqueId')
  async uniqueId(): Promise<string> {
    while (true) {
      const uuid = uuidv4();
      if (await this.webhooksService.fineOne(uuid)) {
        continue;
      }
      return uuid;
    }
  }

  @Post()
  async createWebhook(
    @Body() createWebhookDto: CreateWebhookDto,
  ): Promise<Webhook> {
    return null;
  }

  @Put('/:webhookId')
  async updateWebhook(
    @Param('webhookId') webhookId: string,
    @Body() updateWebhookDto: UpdateWebhookDto,
  ): Promise<Webhook> {
    return null;
  }

  @Get('/:webhookId')
  async getWebhook(@Param('webhookId') webhookId: string): Promise<Webhook> {
    return null;
  }

  @Delete('/:webhookId')
  async deleteWebhook(@Param('webhookId') webhookId: string): Promise<Webhook> {
    return null;
  }

  @Get()
  async getAllWebhooks(): Promise<Webhook[]> {
    return null;
  }

  @Post('/:userId/:webhookId')
  async receiveWebhook(
    @Param('userId') userId: string,
    @Param('webhookId') webhookId: string,
  ): Promise<void> {
    return;
  }
}
