import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NotificationHistory } from './notification-history.entity';
import { NotificationMethod } from './notification-method.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  condition: string;
  @OneToMany(() => NotificationHistory, (history) => history.notification)
  histories: NotificationHistory[];
  @OneToMany(() => NotificationMethod, (method) => method.notification)
  methods: NotificationMethod[];
  @Column()
  userId: string;
  @ManyToOne(() => User, (user) => user.notifications, { cascade: true })
  user: User;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
