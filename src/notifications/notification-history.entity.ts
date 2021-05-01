import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Notification } from './notification.entity';

@Entity()
export class NotificationHistory {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Notification, (notification) => notification.histories)
  notification: Notification;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
