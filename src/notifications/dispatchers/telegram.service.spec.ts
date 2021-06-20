import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { Webhook } from '../../webhooks/entities/webhook.entity';
import { User } from '../../users/user.entity';
import { NotificationHistory } from '../entities/notification-history.entity';
import { NotificationMethod } from '../entities/notification-method.entity';
import { Notification } from '../entities/notification.entity';
import { TelegramService } from './telegram.service';
import { WebhookField } from '../../webhooks/entities/webhook-field.entity';
import { WebhookHistory } from '../../webhooks/entities/webhook-history.entity';

describe('TelegramService', () => {
  let service: TelegramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.development.env',
          validationSchema: Joi.object({
            NODE_ENV: Joi.string()
              .valid('development', 'production', 'test')
              .default('development'),
            PORT: Joi.number().default(3000),
            DATABASE_HOST: Joi.string().default('db'),
            DATABASE_PORT: Joi.number().default(5432),
            DATABASE_USER: Joi.string().default('postgres'),
            DATABASE_PASSWORD: Joi.string().default('postgres'),
            DATABASE_NAME: Joi.string().default('postgres'),
            JWT_SECRET: Joi.string().required(),
            TELEGRAM_BOT_TOKEN: Joi.string().required(),
          }),
          validationOptions: {
            allowUnknown: true,
            abortEarly: true,
          },
          isGlobal: true,
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DATABASE_HOST,
          port: parseInt(process.env.DATABASE_PORT) || 5432,
          username: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
          synchronize: true,
          autoLoadEntities: true,
        }),
        TypeOrmModule.forFeature([
          NotificationMethod,
          Notification,
          NotificationHistory,
          User,
          Webhook,
          WebhookField,
          WebhookHistory,
        ]),
      ],
      providers: [TelegramService],
    }).compile();

    service = module.get<TelegramService>(TelegramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
