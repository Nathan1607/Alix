import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
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
  @JoinColumn({ name: 'commune_id' }) // explicite la FK
  commune!: Commune;

  // (Optionnel : si tu veux accéder à l'id directement)
  @Column({ name: 'commune_id' })
  communeId!: string;

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

  // Méthode utile
  get fullName(): string {
    return `${this.first_name} ${this.last_name}`;
  }
}
