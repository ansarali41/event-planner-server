import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  budget: number;

  @Column()
  location: string;

  @Column()
  venue: string;

  @Column()
  latitude: string;

  @Column()
  longitude: string;

  @Column()
  type: string;

  @Column()
  date: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  createdBy: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'int', nullable: true })
  updatedBy: number;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @Column({ type: 'int', nullable: true })
  deletedBy: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  status: boolean;

  @Column({ type: 'boolean', default: false })
  isPaid: boolean;

  @Column({ type: 'int', nullable: true })
  paidBy: number;

  @Column({ type: 'text', nullable: true })
  userEmail: string;
}
