import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Notification } from './notification.entity';

export enum NotificationMethodType {
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
  type: NotificationMethodType;
  @Column()
  name: string;
  @Column()
  key: string;
  @Column('simple-json')
  subscribers: string[];
  @Column()
  notificationId: number;
  @ManyToOne(() => Notification, (notification) => notification.methods)
  notification: Notification;
}
