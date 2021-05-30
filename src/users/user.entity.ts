import { Webhook } from 'src/webhooks/entities/webhook.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  username: string;
  @Column()
  password: string;
  @Column()
  email: string;
  @OneToMany(() => Webhook, (webhook) => webhook.user)
  webhooks: Webhook[];
  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
