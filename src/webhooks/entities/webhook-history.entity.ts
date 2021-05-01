import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Webhook } from './webhook.entity';

@Entity()
export class WebhookHistory {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('json')
  data: any;
  @ManyToOne(() => Webhook, (webhook) => webhook.histories)
  webhook: Webhook;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
