import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
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
  @PrimaryColumn()
  id: string;
  @Column()
  name: string;
  @Column({ type: 'enum', enum: WebhookType, default: WebhookType.GITHUB })
  type: WebhookType;
  @OneToMany(() => WebhookField, (field) => field.webhook)
  fields: WebhookField[];
  @OneToMany(() => WebhookHistory, (history) => history.webhook)
  histories: WebhookHistory[];
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
