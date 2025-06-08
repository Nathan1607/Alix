import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Commune } from './Commune';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Commune, commune => commune.articles)
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

  @Column({ nullable: true })
  img_4!: string;

  @Column({ nullable: true })
  img_5!: string;

  @Column({ nullable: true })
  img_6!: string;

  @Column()
  published_at!: Date;
}
