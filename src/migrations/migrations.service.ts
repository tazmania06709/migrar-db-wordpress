import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();
// import { CreateMigrationDto } from './dto/create-migration.dto';
// import { UpdateMigrationDto } from './dto/update-migration.dto';

@Injectable()
export class MigrationsService {
  constructor(
    @InjectDataSource('db1') private readonly db1: DataSource, // Inyección de DataSource para la primera base de datos
    @InjectDataSource('db2') private readonly db2: DataSource, // Inyección de DataSource para la segunda base de datos
  ) {}
  // create(createMigrationDto: CreateMigrationDto) {
  //   return 'This action adds a new migration';
  // }

  findAll() {
    const result = this.getDataFromDB1();
    // this.getDataFromDB2();
    return result;
    //return `This action returns all migrations`;
  }

  async findOne(id: number): Promise<any> {
    const result = await this.db1.query('SELECT * FROM inmueble WHERE id = ?', [
      id,
    ]);
    return result.length ? result[0] : null;
    // return `This action returns a #${id} migration`;
  }

  // update(id: number, updateMigrationDto: UpdateMigrationDto) {
  //   return `This action updates a #${id} migration`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} migration`;
  // }

  async getDataFromDB1() {
    const queryRunner = this.db1.createQueryRunner();
    await queryRunner.connect();
    const result = await queryRunner.query('SELECT * FROM inmueble');
    await queryRunner.release();
    console.log(result, 'Resultado');
    return result;
  }

  async getDataFromDB2() {
    const queryRunner = this.db2.createQueryRunner();
    await queryRunner.connect();
    const result = await queryRunner.query('SELECT * FROM w47fa_posts');
    await queryRunner.release();
    return result;
  }
}
