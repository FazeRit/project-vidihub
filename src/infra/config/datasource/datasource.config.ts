import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const datasource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.NODE_ENV === 'development',
  entities: ['src/**/*.model.{ts,js}'],
  migrations: ['src/infra/persistence/migrations/*.{ts,js}'],
});
