import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Commune } from './Commune';
import { Registration } from './Registration';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Commune, commune => commune.events)
  commune!: Commune;

  @Column({ nullable: true })
  title_1!: string;

  @Column({ nullable: true })
  title_2!: string;

  @Column({ nullable: true })
  title_3!: string;

  @Column({ nullable: true })
  text_1!: string;

  @Column({ nullable: true })
  text_2!: string;

  @Column({ nullable: true })
  text_3!: string;

  @Column({ nullable: true })
  img_1!: string;

  @Column({ nullable: true })
  img_2!: string;

  @Column({ nullable: true })
  img_3!: string;

  @Column()
  start_time!: Date;

  @Column()
  end_time!: Date;

  @Column()
  published_at!: Date;

  @OneToMany(() => Registration, registration => registration.event)
  registrations!: Registration[];
}
