import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async findOne(id: number): Promise<Webhook> {
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

  async addWebhookHistory(id: number, data: any): Promise<WebhookHistory> {
    //TODO: handle webhook & add history
    return null;
  }

  async update(
    id: number,
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
      id,
      ...updateWebhookDto,
      fields,
    });

    return this.webhooksRepository.save(webhook);
  }

  async remove(username: string, id: number): Promise<Webhook> {
    const webhook = await this.findOne(id);
    if (webhook.userId !== username) {
      throw new BadRequestException(`cannot remove other users webhook`);
    }
    return this.webhooksRepository.remove(webhook);
  }
}
