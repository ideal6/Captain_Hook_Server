import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { CreateFieldDto } from './dto/create-field.dto';
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
    @InjectRepository(WebhookHistory)
    private readonly webhookHistoriesRepository: Repository<WebhookHistory>,
  ) {}

  async findAll(username: string): Promise<Webhook[]> {
    return this.webhooksRepository.find({
      where: { userId: username },
      relations: ['fields', 'histories'],
    });
  }

  async findOne(id: number): Promise<Webhook> {
    const webhook = await this.webhooksRepository.findOne({
      where: { id },
      relations: ['fields', 'histories'],
    });
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

  async addWebhookHistory(
    webhookId: number,
    data: any,
  ): Promise<WebhookHistory> {
    const webhookHistory: WebhookHistory = await this.webhookHistoriesRepository.create(
      { data },
    );
    webhookHistory.webhook = await this.findOne(webhookId);
    return this.webhookHistoriesRepository.save(webhookHistory);
  }

  async update(
    id: number,
    updateWebhookDto: UpdateWebhookDto,
  ): Promise<Webhook> {
    await this.findOne(id);
    const fields =
      updateWebhookDto.fields &&
      (await Promise.all(
        updateWebhookDto.fields.map((field) => {
          if (field.id === undefined) {
            return this.webhookFieldsRepository.create(field);
          } else {
            return this.webhookFieldsRepository.preload(field);
          }
        }),
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
