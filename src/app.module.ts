import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MigrationsModule } from './migrations/migrations.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.SOURCE_DB_HOST,
      port: 3306,
      username: process.env.SOURCE_DB_USER,
      password: process.env.SOURCE_DB_PASSWORD,
      database: process.env.SOURCE_DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.WP_DB_HOST,
      port: 3306,
      username: process.env.SOURCE_DB_USER,
      password: process.env.SOURCE_DB_PASSWORD,
      database: process.env.WP_DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
    }),
    MigrationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
