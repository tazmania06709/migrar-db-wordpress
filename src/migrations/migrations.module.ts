import { Module } from '@nestjs/common';
import { MigrationsService } from './migrations.service';
import { MigrationsController } from './migrations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([], 'db1'),
    TypeOrmModule.forFeature([], 'db2'),
  ],
  controllers: [MigrationsController],
  providers: [MigrationsService],
})
export class MigrationsModule {}

// Repositorios específicos para cada base de datos
// TypeOrmModule.forFeature([], 'db1'),
// TypeOrmModule.forFeature([], 'db2'),
