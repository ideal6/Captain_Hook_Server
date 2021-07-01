import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebhookField } from '../webhooks/entities/webhook-field.entity';
import { WebhookHistory } from '../webhooks/entities/webhook-history.entity';
import { Webhook } from '../webhooks/entities/webhook.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationHistory } from './entities/notification-history.entity';
import {
  NotificationMethod,
  NotificationMethodType,
} from './entities/notification-method.entity';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
    @InjectRepository(NotificationMethod)
    private readonly notificationMethodsRepository: Repository<NotificationMethod>,
    @InjectRepository(NotificationHistory)
    private readonly notificationHistoriesRepository: Repository<NotificationHistory>,
    @InjectRepository(Webhook)
    private readonly webhooksRepository: Repository<Webhook>,
    @InjectRepository(WebhookField)
    private readonly webhookFieldsRepository: Repository<WebhookField>,
    @InjectRepository(WebhookHistory)
    private readonly webhookHistoriesRepository: Repository<WebhookHistory>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAll(username: string): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: {
        userId: username,
      },
      relations: ['dependentWebhooks', 'methods'],
    });
  }

  async findOne(id: number): Promise<Notification> {
    const webhook = await this.notificationsRepository.findOne(id, {
      relations: ['dependentWebhooks', 'methods'],
    });
    if (!webhook) throw new NotFoundException(`webhook #${id} not found`);
    return webhook;
  }

  async addNotification(
    username: string,
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const notification = this.notificationsRepository.create({
      ...createNotificationDto,
      userId: username,
    });
    for (const method of notification.methods) {
      if (
        method.type !== NotificationMethodType.EMAIL &&
        method.type !== NotificationMethodType.SMS
      ) {
        method.key = method.id?.toString() || '';
      }
    }
    notification.dependentWebhooks = [];
    await this.notificationsRepository.save(notification);
    const dependent = [];
    const [left, center, right] = notification.condition.split('|');
    if (left.startsWith('&')) {
      const webhookField = await this.webhookFieldsRepository.findOne({
        where: { id: +left.substr(1) },
        relations: ['webhook'],
      });
      dependent.push(webhookField.webhook);
    }
    if (right.startsWith('&')) {
      const webhookField = await this.webhookFieldsRepository.findOne({
        where: { id: +right.substr(1) },
        relations: ['webhook'],
      });
      if (dependent.length > 0 && dependent[0].id !== webhookField.webhook.id)
        dependent.push(webhookField.webhook);
    }
    notification.dependentWebhooks = dependent;
    return this.notificationsRepository.save(notification);
  }

  @OnEvent('webhook_received')
  async addNotificationHistory({
    webhook,
    data,
  }: {
    webhook: Webhook;
    data: any;
  }): Promise<NotificationHistory> {
    //TODO: Handle Notification History
    const notifications: Notification[] = await this.notificationsRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.dependentWebhooks', 'noti_webhook')
      .where('noti_webhook.id=:id', { id: webhook.id })
      .getMany();

    notifications.forEach(async (notification) => {
      try {
        notification = await this.notificationsRepository.findOne({
          where: { id: notification.id },
          relations: ['methods', 'dependentWebhooks', 'methods.notification'],
        });
        const [left, center, right] = notification.condition.split('|');
        console.log(left, right);
        const leftData = left.startsWith('$')
          ? left.substr(1)
          : await this.getData(left);
        const rightData = right.startsWith('$')
          ? right.substr(1)
          : await this.getData(right);
        console.log(leftData, center, rightData);
        const result = eval(`'${leftData}' ${center} '${rightData}'`);
        if (result) {
          // 조건 성공
          for (const method of notification.methods)
            this.eventEmitter.emit(`noti_${method.type}`, method);
        }
      } catch (e) {
        console.error(e);
      }
    });
    return null;
  }
  async getData(leftRight: string): Promise<any> {
    let data = null;
    const field = await this.webhookFieldsRepository.findOne({
      where: { id: +leftRight.substr(1) },
      relations: ['webhook', 'webhook.histories'],
    });
    data = field.webhook.histories[field.webhook.histories.length - 1].data;
    if (field.webhook.type === 'github') data = JSON.parse(data.payload);
    return (data = field.field
      .substr(1)
      .split('.')
      .reduce((p, c) => p[c], data));
  }

  async update(
    id: number,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    await this.findOne(id);
    const methods: NotificationMethod[] =
      (updateNotificationDto.methods &&
        (await Promise.all(
          updateNotificationDto.methods.map((dto) =>
            dto.id === undefined || dto.id === null
              ? this.notificationMethodsRepository.create(dto)
              : this.notificationMethodsRepository.preload(dto),
          ),
        ))) ||
      [];

    for (const method of methods) {
      console.log(method);
      if (
        method.type !== NotificationMethodType.EMAIL &&
        method.type !== NotificationMethodType.SMS
      ) {
        method.key = method.id?.toString() || '';
      }
    }
    const notification = await this.notificationsRepository.preload({
      id,
      ...updateNotificationDto,
      methods,
    });
    notification.dependentWebhooks = [];
    await this.notificationsRepository.save(notification);
    const dependent: Webhook[] = [];
    const [left, center, right] = notification.condition.split('|');
    if (left.startsWith('&')) {
      const webhookField = await this.webhookFieldsRepository.findOne({
        where: { id: +left.substr(1) },
        relations: ['webhook'],
      });
      dependent.push(webhookField.webhook);
    }
    if (right.startsWith('&')) {
      const webhookField = await this.webhookFieldsRepository.findOne({
        where: { id: +right.substr(1) },
        relations: ['webhook'],
      });
      if (dependent.length > 0 && dependent[0].id !== webhookField.webhook.id)
        dependent.push(webhookField.webhook);
    }

    notification.dependentWebhooks = dependent;
    return this.notificationsRepository.save(notification);
  }

  async remove(username: string, id: number): Promise<Notification> {
    const webhook = await this.findOne(id);
    if (webhook.userId !== username)
      throw new BadRequestException(`cannot remove other users notification`);

    return this.notificationsRepository.remove(webhook);
  }
}
