import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./../class/User";
import { Commune } from "./../class/Commune";
import { Article } from "./../class/Article";
import { Event } from "./../class/Event";
import { Workshop } from "./../class/Workshop";
import { Registration } from "./../class/Registration";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Commune, Article, Event, Workshop, Registration],
  synchronize: true,
  logging: false,
});
