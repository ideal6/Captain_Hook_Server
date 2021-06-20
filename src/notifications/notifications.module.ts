import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SmsService } from './dispatchers/sms.service';
import { SlackService } from './dispatchers/slack.service';
import { DiscordService } from './dispatchers/discord.service';
import { EmailService } from './dispatchers/email.service';
import { TelegramService } from './dispatchers/telegram.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationHistory } from './entities/notification-history.entity';
import { Notification } from './entities/notification.entity';
import { NotificationMethod } from './entities/notification-method.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotificationHistory,
      NotificationMethod,
      Notification,
    ]),
  ],
  providers: [
    NotificationsService,
    SmsService,
    SlackService,
    DiscordService,
    EmailService,
    TelegramService,
  ],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
