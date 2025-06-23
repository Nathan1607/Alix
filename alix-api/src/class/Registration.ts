import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

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
}
