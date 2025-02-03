import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const dbConfig1: TypeOrmModuleOptions = {
  name: 'db1',
  type: 'mysql',
  host: process.env.SOURCE_DB_HOST,
  port: 3306,
  username: process.env.SOURCE_DB_USER,
  password: process.env.SOURCE_DB_PASSWORD,
  database: process.env.SOURCE_DB_NAME,
  autoLoadEntities: false,
  synchronize: false,
};

export const dbConfig2: TypeOrmModuleOptions = {
  name: 'db2',
  type: 'mysql',
  host: process.env.WP_DB_HOST,
  port: 3306,
  username: process.env.WP_DB_USER,
  password: process.env.WP_DB_PASSWORD,
  database: process.env.WP_DB_NAME,
  autoLoadEntities: false,
  synchronize: false,
};
