import { Entity, PrimaryColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from './User';
import { Article } from './Article';
import { Event } from './Event';
import { Workshop } from './Workshop';

@Entity('communes')
export class Commune {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  postal_code!: string;

  @Column()
  region!: string;

  @Column()
  department!: string;

  @Column({ default: 'France' })
  country!: string;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => User, user => user.commune)
  users!: User[];

  @OneToMany(() => Article, article => article.commune)
  articles!: Article[];

  @OneToMany(() => Event, event => event.commune)
  events!: Event[];

  @OneToMany(() => Workshop, workshop => workshop.commune)
  workshops!: Workshop[];
}
