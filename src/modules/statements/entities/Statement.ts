import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { ColumnNumericTransformer } from '@/database/transformers/ColumnNumericTransformer';

import { User } from '../../users/entities/User';

export enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

@Entity('statements')
export class Statement {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column('uuid')
  user_id: string;

  @ManyToOne(() => User, (user) => user.statement)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('uuid')
  sender_id?: string;

  @ManyToOne(() => User, (sender) => sender.statement)
  @JoinColumn({ name: 'sender_id' })
  sender?: User;

  @Column()
  description: string;

  @Column('decimal', {
    precision: 5,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  amount: number;

  @Column({ type: 'enum', enum: OperationType })
  type: OperationType;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;
}
