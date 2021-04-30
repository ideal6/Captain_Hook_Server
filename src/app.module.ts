import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { Webhook } from './webhooks/webhook.entity';
@Module({
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
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Webhook],
      synchronize: true,
    }),
    UsersModule,
    WebhooksModule,
    NotificationsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
