import { Injectable, OnModuleInit } from '@nestjs/common';
import { IDispatcher } from '../../types';
import { NotificationMethod } from '../entities/notification-method.entity';
import * as nodemailer from 'nodemailer';
import { OnEvent } from '@nestjs/event-emitter';
@Injectable()
export class EmailService implements IDispatcher, OnModuleInit {
  public transporter: nodemailer.Transporter;
  async onModuleInit() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });
  }
  @OnEvent('noti_email')
  async dispatch(notificationMethod: NotificationMethod) {
    console.log(notificationMethod);
    await this.transporter.sendMail({
      from: `"Captain Hook" <${process.env.NODEMAILER_USER}>`,
      to: `${notificationMethod.key}`,
      subject: `Captain Hook 알림 ${notificationMethod.notification.name}`,
      text: `Captain Hook 알림 ${notificationMethod.notification.name}의 알림조건이 만족했습니다.`,
      html: `Captain Hook 알림 ${notificationMethod.notification.name}의 알림조건이 만족했습니다.`,
    });
  }
}
