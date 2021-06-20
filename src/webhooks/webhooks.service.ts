import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { WebhookField } from './entities/webhook-field.entity';
import { WebhookHistory } from './entities/webhook-history.entity';
import { Webhook } from './entities/webhook.entity';

@Injectable()
export class WebhooksService {
  constructor(
    @InjectRepository(Webhook)
    private readonly webhooksRepository: Repository<Webhook>,
    @InjectRepository(WebhookField)
    private readonly webhookFieldsRepository: Repository<WebhookField>,
  ) {}

  async findAll(username: string): Promise<Webhook[]> {
    return this.webhooksRepository.find({ userId: username });
  }

  async findOne(id: string): Promise<Webhook> {
    const webhook = await this.webhooksRepository.findOne(id);
    if (!webhook) throw new NotFoundException(`Webhook "${id}" not found`);
    return webhook;
  }

  async addWebhook(
    username: string,
    createWebhookDto: CreateWebhookDto,
  ): Promise<Webhook> {
    const fields = await Promise.all(
      createWebhookDto.fields.map((field) =>
        this.webhookFieldsRepository.create(field),
      ),
    );
    const webhook = await this.webhooksRepository.create({
      ...createWebhookDto,
      fields,
      userId: username,
    });
    return this.webhooksRepository.save(webhook);
  }

  async addWebhookHistory(id: string, data: any): Promise<WebhookHistory> {
    //TODO: handle webhook & add history
    return null;
  }

  async update(
    id: string,
    updateWebhookDto: UpdateWebhookDto,
  ): Promise<Webhook> {
    await this.findOne(id);
    const fields =
      updateWebhookDto.fields &&
      (await Promise.all(
        updateWebhookDto.fields.map((field) =>
          this.webhookFieldsRepository.preload(field),
        ),
      ));

    const webhook = await this.webhooksRepository.preload({
      ...updateWebhookDto,
      fields,
    });

    return this.webhooksRepository.save(webhook);
  }

  async remove(id: string): Promise<Webhook> {
    const webhook = await this.findOne(id);
    return this.webhooksRepository.remove(webhook);
  }
}
