import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from './entities/User';

dotenv.config({path: "./src/environments/.env"});

export const initDB: DataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User],
  migrations: ["./src/migrations/*.ts"],
  synchronize: false,
  logging: true
})

initDB.initialize().catch((err) => {
  console.log(err);
})