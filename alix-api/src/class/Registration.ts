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

  @ManyToOne(() => Event, { nullable: true })
  @JoinColumn({ name: 'event_id' })
  event?: Event;

  @ManyToOne(() => Workshop, { nullable: true })
  @JoinColumn({ name: 'workshop_id' })
  workshop?: Workshop;

  @Column()
  registered_at!: Date;
}
