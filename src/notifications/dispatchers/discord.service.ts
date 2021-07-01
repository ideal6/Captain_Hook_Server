import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import * as Discord from 'discord.js';
import { Repository } from 'typeorm';
import { IDispatcher } from '../../types';
import { NotificationMethod } from '../entities/notification-method.entity';
@Injectable()
export class DiscordService implements IDispatcher {
  private readonly client: Discord.Client;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(NotificationMethod)
    private readonly notificationMethodRepository: Repository<NotificationMethod>,
  ) {
    this.client = new Discord.Client();
    this.client.on('message', (msg) => {
      if (msg.content.startsWith('/subscribe')) this.subscribe(msg);
      else if (msg.content.startsWith('/unsubscribe')) this.unsubscribe(msg);
    });
    this.client.login(configService.get<string>('DISCORD_BOT_TOKEN'));
  }

  async subscribe(msg: Discord.Message) {
    const notificationMethod: NotificationMethod = await this.notificationMethodRepository.findOne(
      +msg.content.split(' ')[1],
    );

    notificationMethod.subscribers = [
      ...new Set([...notificationMethod.subscribers, msg.author.id.toString()]),
    ];
    await this.notificationMethodRepository.save(notificationMethod);
    (await this.client.users.fetch(msg.author.id)).send('등록하였습니다.');
  }

  async unsubscribe(msg: Discord.Message) {
    const notificationMethod: NotificationMethod = await this.notificationMethodRepository.findOne(
      +msg.content.split(' ')[1],
    );

    notificationMethod.subscribers = [
      ...new Set([
        ...notificationMethod.subscribers.filter(
          (chatId) => chatId !== msg.author.id.toString(),
        ),
      ]),
    ];
    await this.notificationMethodRepository.save(notificationMethod);
    (await this.client.users.fetch(msg.author.id)).send('등록 해제하였습니다.');
  }

  @OnEvent('noti_discord')
  async dispatch(notificationMethod: NotificationMethod) {
    console.log(notificationMethod);
    notificationMethod.subscribers.forEach(async (sub) =>
      (await this.client.users.fetch(sub)).send(
        `Captain Hook 알림 ${notificationMethod.notification.name}의 알림조건이 만족했습니다.`,
      ),
    );
  }
}
