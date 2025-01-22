import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("User")
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    idCommune!: number;

    @Column({ nullable: true })
    idParametre!: number;

    @Column({ type: "varchar", nullable: true })
    nom!: string;

    @Column({ type: "varchar", nullable: true })
    prenom!: string;

    @Column({ type: "varchar", nullable: true })
    adresse!: string;

    @Column({ nullable: true })
    numeroFixe!: number;

    @Column({ nullable: true })
    numeroPortable!: number;
}
