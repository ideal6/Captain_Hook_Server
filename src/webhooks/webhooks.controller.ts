import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.gurad';
import { User } from '../common/user.decorator';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { Webhook } from './entities/webhook.entity';
import { WebhooksService } from './webhooks.service';

@UseGuards(JwtAuthGuard)
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post()
  async createWebhook(
    @User('username') username: string,
    @Body() createWebhookDto: CreateWebhookDto,
  ): Promise<Webhook> {
    return this.webhooksService.addWebhook(username, createWebhookDto);
  }

  @Put('/:webhookId')
  async updateWebhook(
    @Param('webhookId') webhookId: number,
    @Body() updateWebhookDto: UpdateWebhookDto,
  ): Promise<Webhook> {
    return this.webhooksService.update(webhookId, updateWebhookDto);
  }

  @Get('/:webhookId')
  async getWebhook(@Param('webhookId') webhookId: number): Promise<Webhook> {
    return this.webhooksService.findOne(webhookId);
  }

  @Delete('/:webhookId')
  async deleteWebhook(
    @User('username') username,
    @Param('webhookId') webhookId: number,
  ): Promise<Webhook> {
    return this.webhooksService.remove(username, webhookId);
  }

  @Get()
  async getAllWebhooks(@User('username') username: string): Promise<Webhook[]> {
    return this.webhooksService.findAll(username);
  }

  @Post('w/:webhookId')
  async receiveWebhook(
    @Param('webhookId') webhookId: number,
    @Body() data: any,
  ): Promise<boolean> {
    //TODO: handle webhook & add history
    await this.webhooksService.addWebhookHistory(webhookId, data);
    return true;
  }
}
