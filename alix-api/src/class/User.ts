import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { Commune } from './Commune';
import { Registration } from './Registration';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  first_name!: string;

  @Column()
  last_name!: string;

  @ManyToOne(() => Commune, commune => commune.users)
  commune!: Commune;

  @Column({ nullable: true })
  address!: string;

  @Column({ nullable: true })
  phone_landline!: string;

  @Column({ nullable: true })
  phone_mobile!: string;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => Registration, registration => registration.user)
  registrations!: Registration[];
}
