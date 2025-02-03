import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MigrationsModule } from './migrations/migrations.module';
import { dbConfig1, dbConfig2 } from './db/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dbConfig1), // Primera conexión
    TypeOrmModule.forRoot(dbConfig2), // Segunda conexión
    MigrationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
