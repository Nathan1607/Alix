import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Event } from './Event';
import { Workshop } from './Workshop';

@Entity('registrations')
export class Registration {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.registrations)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ default: 'evenement' })
  content_type!: string;

  @Column()
  content_id!: number;

  @Column()
  registered_at!: Date;

  // Relations indirectes (non typées par TypeORM, à gérer manuellement si besoin)
  event?: Event;
  workshop?: Workshop;
}
