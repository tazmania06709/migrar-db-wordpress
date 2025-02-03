import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();
// import { CreateMigrationDto } from './dto/create-migration.dto';
// import { UpdateMigrationDto } from './dto/update-migration.dto';

@Injectable()
export class MigrationsService {
  constructor(
    private readonly db1: DataSource,
    private readonly db2: DataSource,
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

  findOne(id: number) {
    return `This action returns a #${id} migration`;
  }

  // update(id: number, updateMigrationDto: UpdateMigrationDto) {
  //   return `This action updates a #${id} migration`;
  // }

  remove(id: number) {
    return `This action removes a #${id} migration`;
  }

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
    const result = await queryRunner.query('SELECT * FROM products');
    await queryRunner.release();
    return result;
  }
}
