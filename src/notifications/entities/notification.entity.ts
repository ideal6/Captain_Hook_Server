import { User } from '../../users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NotificationHistory } from './notification-history.entity';
import { NotificationMethod } from './notification-method.entity';
import { Webhook } from '../../webhooks/entities/webhook.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  condition: string;
  @OneToMany(() => NotificationHistory, (history) => history.notification)
  histories: NotificationHistory[];
  @OneToMany(() => NotificationMethod, (method) => method.notification)
  methods: NotificationMethod[];
  @ManyToMany(() => Webhook)
  @JoinTable()
  dependentWebhooks: Webhook[];
  @Column()
  userId: string;
  @ManyToOne(() => User, (user) => user.notifications, { cascade: true })
  user: User;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
