import { User } from '../../users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WebhookField } from './webhook-field.entity';
import { WebhookHistory } from './webhook-history.entity';
export enum WebhookType {
  GITHUB = 'github',
  CUSTOM = 'custom',
}
@Entity()
export class Webhook {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ type: 'enum', enum: WebhookType, default: WebhookType.GITHUB })
  type: WebhookType;
  @OneToMany(() => WebhookField, (field) => field.webhook, {
    cascade: true,
  })
  fields: WebhookField[];
  @OneToMany(() => WebhookHistory, (history) => history.webhook, {
    cascade: true,
  })
  histories: WebhookHistory[];
  @Column()
  userId: string;
  @ManyToOne(() => User, (user) => user.webhooks)
  user: User;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
