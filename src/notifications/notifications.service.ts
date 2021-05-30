import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationMethodDto } from './dto/create-notification-method.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationHistory } from './entities/notification-history.entity';
import { NotificationMethod } from './entities/notification-method.entity';
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
  ) {}

  async findAll(username: string): Promise<Notification[]> {
    return this.notificationsRepository.find({ userId: username });
  }

  async findOne(id: number): Promise<Notification> {
    const webhook = await this.notificationsRepository.findOne(id);
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
    return this.notificationsRepository.save(notification);
  }

  async addNotificationHistory(): Promise<NotificationHistory> {
    //TODO: Handle Notification History
    return null;
  }

  async update(
    id: number,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    await this.findOne(id);
    const methods =
      updateNotificationDto.methods &&
      (await Promise.all(
        updateNotificationDto.methods.map((dto) =>
          dto instanceof CreateNotificationMethodDto
            ? this.notificationMethodsRepository.create(dto)
            : this.notificationMethodsRepository.preload(dto),
        ),
      ));

    const notification = await this.notificationsRepository.preload({
      id,
      ...updateNotificationDto,
      methods,
    });
    return this.notificationsRepository.save(notification);
  }

  async remove(id: number): Promise<Notification> {
    const webhook = await this.findOne(id);
    return this.notificationsRepository.remove(webhook);
  }
}
