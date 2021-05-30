import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Notification } from './notification.entity';

export enum NotificaitonMethodType {
  EMAIL = 'email',
  SMS = 'sms',
  DISCORD = 'discord',
  TELEGRAM = 'telegram',
  SLACK = 'slack',
}

@Entity()
export class NotificationMethod {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  type: NotificaitonMethodType;
  @Column()
  name: string;
  @Column()
  key: string;
  @ManyToOne(() => Notification, (notification) => notification.methods)
  notification: Notification;
}
