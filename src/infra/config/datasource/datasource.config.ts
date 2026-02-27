import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const datasource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOS,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.ENVIRONMENT === 'dev' ? true : false,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
});
