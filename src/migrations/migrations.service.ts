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
    @InjectDataSource('db1') private readonly sourceDb: DataSource, // Inyección de DataSource para la primera base de datos
    @InjectDataSource('db2') private readonly wpDb: DataSource, // Inyección de DataSource para la segunda base de datos
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
    try {
      const inmueble = await this.sourceDb.query(
        'SELECT * FROM inmueble WHERE id = ?',
        [id],
      );
      if (!inmueble.length) {
        throw new Error('Inmueble no encontrado');
      }
      const inmuebleComplete = await this.sourceDb.query(
        `
            SELECT 
                i.id, 
                i.referencia, 
                i.codigo, 
                p.nombre AS provincia,
                m.nombre AS municipio, 
                r.nombre AS reparto, 
                s.situado AS situacion,
                e.estado AS estadoConstruccion, 
                i.superficie,               
                CASE WHEN i.ascensor = 1 THEN "Sí" ELSE "No" END AS ascensor,
                CASE WHEN i.garage = 1 THEN "Sí" ELSE "No" END AS garage,
                CASE WHEN i.telefono = 1 THEN "Sí" ELSE "No" END AS telefono,
                rg.regimen AS regimen,  
                i.precio, 
                i.titulo,
                i.descripcion, 
                i.fabricacion, 
                i.imagenPortada,
                CASE WHEN i.publicado = 1 THEN "Publicado" ELSE "No Publicado" END AS publicado
            FROM inmueble i 
            LEFT JOIN tipoinmueble t ON i.tipo = t.id 
            LEFT JOIN provincia p ON i.provincia = p.id
            LEFT JOIN municipio m ON i.municipio = m.id 
            LEFT JOIN reparto r ON i.reparto = r.id
            LEFT JOIN situacion s ON i.situado = s.id 
            LEFT JOIN estadoconstructivo e ON i.estadoConstruccion = e.id
            LEFT JOIN parteinmueble pi ON i.id = pi.inmueble
            LEFT JOIN partes parte ON pi.id = parte.id 
            LEFT JOIN regimen rg ON i.regimen = rg.id
            WHERE i.id = ?
            GROUP BY i.id;
            `,
        [id],
      );

      const data = inmueble[0]; // Obtener el primer resultado
      console.log(data, 'data');

      // Insertar en la base de datos de WordPress
      // const insertQuery = `
      // INSERT INTO w47fa_posts (
      // post_title,
      // post_type,
      // post_author,
      // post_content,
      // post_name,
      // guid)
      // VALUES (?, 1, ?, ?, ?, ?)`;

      // const result = await this.wpDb.query(insertQuery, [
      //   data.post_title,
      //   data.post_author,
      //   data.post_content,
      //   data.post_name,
      //   data.guid,
      // ]);

      return inmuebleComplete;
      //  return inmueble.length ? inmueble[0] : null;
      // return `This action returns a #${id} migration`;
    } catch (error) {
      console.error('Error al obtener el inmueble:', error);
      throw error;
    }
  }

  // update(id: number, updateMigrationDto: UpdateMigrationDto) {
  //   return `This action updates a #${id} migration`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} migration`;
  // }

  async getDataFromDB1() {
    const queryRunner = this.sourceDb.createQueryRunner();
    await queryRunner.connect();
    const result = await queryRunner.query('SELECT * FROM inmueble');
    await queryRunner.release();
    console.log(result, 'Resultado');
    return result;
  }

  async getDataFromDB2() {
    const queryRunner = this.wpDb.createQueryRunner();
    await queryRunner.connect();
    const result = await queryRunner.query('SELECT * FROM w47fa_posts');
    await queryRunner.release();
    return result;
  }
}
