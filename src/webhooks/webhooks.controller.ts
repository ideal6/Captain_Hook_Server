import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { User } from 'src/common/user.decorator';
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
      if (await this.webhooksService.findOne(uuid)) {
        continue;
      }
      return uuid;
    }
  }

  @Post()
  async createWebhook(
    @Body() createWebhookDto: CreateWebhookDto,
  ): Promise<Webhook> {
    return this.webhooksService.addWebhook(createWebhookDto);
  }

  @Put('/:webhookId')
  async updateWebhook(
    @Param('webhookId') webhookId: string,
    @Body() updateWebhookDto: UpdateWebhookDto,
  ): Promise<Webhook> {
    return this.webhooksService.update(webhookId, updateWebhookDto);
  }

  @Get('/:webhookId')
  async getWebhook(@Param('webhookId') webhookId: string): Promise<Webhook> {
    return this.webhooksService.findOne(webhookId);
  }

  @Delete('/:webhookId')
  async deleteWebhook(@Param('webhookId') webhookId: string): Promise<Webhook> {
    return this.webhooksService.remove(webhookId);
  }

  @Get()
  async getAllWebhooks(@User('username') username: string): Promise<Webhook[]> {
    return this.webhooksService.findAll(username);
  }

  @Post('w/:webhookId')
  async receiveWebhook(
    @Param('webhookId') webhookId: string,
    @Body() data: any,
  ): Promise<boolean> {
    await this.webhooksService.addWebhookHistory(webhookId, data);
    return true;
  }
}
