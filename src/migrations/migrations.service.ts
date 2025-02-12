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

  // Funcion Get All Inmuebles
  async getInmuebles() {
    const queryRunner = this.sourceDb.createQueryRunner();
    await queryRunner.connect();

    try {
      const result = await queryRunner.query('SELECT * FROM inmueble');
      const inmueblesCompletos = [];

      for (const element of result) {
        try {
          const inmueble = await this.sourceDb.query(
            'SELECT * FROM inmueble WHERE id = ?',
            [element.id],
          );

          if (!inmueble.length) {
            throw new Error('Inmueble no encontrado');
          }

          const imagenAll = await this.sourceDb.query(
            'SELECT * FROM imagenes WHERE inmueble = ?',
            [element.id],
          );

          const resultQuery = await this.sourceDb.query(
            `SELECT 
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
              GROUP BY i.id;`,
            [element.id],
          );

          const partesInmueble = await this.sourceDb.query(
            `SELECT 
                  parte.id AS parteId,
                  parte.parte AS parteNombre,
                  pi.cantidad,
                  pi.largo,
                  pi.ancho,
                  pi.altura,
                  pi.descripcion
              FROM parteinmueble pi
              INNER JOIN partes parte ON pi.parte = parte.id
              WHERE pi.inmueble = ?`,
            [element.id],
          );

          const inmuebleComplete = {
            ...resultQuery[0],
            partes: partesInmueble,
            imagenes: imagenAll,
          };

          inmueblesCompletos.push(inmuebleComplete);
        } catch (error) {
          console.error('Error al obtener el inmueble:', error);
        }
      }

      return inmueblesCompletos;
    } catch (error) {
      console.error('Error en la consulta principal:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
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
      const imagenAll = await this.sourceDb.query(
        'SELECT * FROM imagenes WHERE inmueble = ?',
        [id],
      );
      console.log(imagenAll);
      const resultQuery = await this.sourceDb.query(
        `SELECT 
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
                i.descripcion, 
                i.fabricacion, 
                i.imagenPortada,
                CASE WHEN i.publicado = 1 THEN "Publicado" ELSE "No Publicado" END AS publicado
                -- Subconsulta para obtener las partes                
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

      const partesInmueble = await this.sourceDb.query(
        `SELECT 
            parte.id AS parteId,
            parte.parte AS parteNombre,
            pi.cantidad,
            pi.largo,
            pi.ancho,
            pi.altura,
            pi.descripcion
        FROM parteinmueble pi
        INNER JOIN partes parte ON pi.parte = parte.id
        WHERE pi.inmueble = ?
        `,
        [id],
      );
      // console.log(resultQuery, 'inmueble', partesInmueble, 'Partes');

      //const data = inmueble[0]; // Obtener el primer resultado
      const inmuebleComplete = {
        ...resultQuery[0],
        partes: partesInmueble,
        imagenes: imagenAll,
      };

      console.log(inmuebleComplete, 'data');

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

    try {
      const result = await queryRunner.query('SELECT * FROM inmueble');
      const inmueblesCompletos = [];

      for (const element of result) {
        try {
          const inmueble = await this.sourceDb.query(
            'SELECT * FROM inmueble WHERE id = ?',
            [element.id],
          );

          if (!inmueble.length) {
            throw new Error('Inmueble no encontrado');
          }

          const imagenAll = await this.sourceDb.query(
            'SELECT * FROM imagenes WHERE inmueble = ?',
            [element.id],
          );

          const resultQuery = await this.sourceDb.query(
            `SELECT 
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
                    GROUP BY i.id;`,
            [element.id],
          );

          const partesInmueble = await this.sourceDb.query(
            `SELECT 
                        parte.id AS parteId,
                        parte.parte AS parteNombre,
                        pi.cantidad,
                        pi.largo,
                        pi.ancho,
                        pi.altura,
                        pi.descripcion
                    FROM parteinmueble pi
                    INNER JOIN partes parte ON pi.parte = parte.id
                    WHERE pi.inmueble = ?`,
            [element.id],
          );

          const inmuebleComplete = {
            ...resultQuery[0],
            partes: partesInmueble,
            imagenes: imagenAll,
          };

          inmueblesCompletos.push(inmuebleComplete);
        } catch (error) {
          console.error('Error al obtener el inmueble:', error);
        }
      }

      return inmueblesCompletos;
    } catch (error) {
      console.error('Error en la consulta principal:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getDataFromDB2() {
    const queryRunner = this.wpDb.createQueryRunner();
    await queryRunner.connect();
    const result = await queryRunner.query('SELECT * FROM w47fa_posts');
    await queryRunner.release();
    return result;
  }

  async insertProvince() {
    const queryRunner = this.sourceDb.createQueryRunner();
    const queryRunnerWP = this.wpDb.createQueryRunner();

    await queryRunner.connect();
    await queryRunnerWP.connect();

    try {
      await queryRunnerWP.startTransaction(); // 🔹 Inicia la transacción

      const province = await queryRunner.query('SELECT * FROM provincia');
      // console.log(province, 'Provincia');

      for (const element of province) {
        // 🔹 Usa `for...of` en lugar de `forEach`
        const name = await queryRunnerWP.query(
          `SELECT * FROM w47fa_terms AS terms WHERE terms.name = ?`,
          [element.nombre],
        );
        // console.log(name, 'Provincia');

        if (name.length === 0) {
          const insertQuery = `
          INSERT INTO w47fa_terms (name, slug, term_group)
          VALUES (?, ?, 0)`;

          const result: any = await queryRunnerWP.query(insertQuery, [
            element.nombre,
            this.normalizeText(element.nombre),
          ]);

          const insertQuery2 = `
          INSERT INTO w47fa_term_taxonomy (term_id, taxonomy, description, parent, count)
          VALUES (?, 'property_country', '', 91, 0)`;

          await queryRunnerWP.query(insertQuery2, [result.insertId]); // 🔹 Usa `insertId`
        }
      }

      await queryRunnerWP.commitTransaction(); // 🔹 Confirma la transacción
    } catch (error) {
      await queryRunnerWP.rollbackTransaction(); // 🔹 Revierte cambios en caso de error
      console.error('Error en la inserción:', error);
    } finally {
      await queryRunner.release();
      await queryRunnerWP.release(); // 🔹 Libera el queryRunner al final
    }
  }

  //---Municipios--
  async insertMunicipalities() {
    const queryRunner = this.sourceDb.createQueryRunner();
    const queryRunnerWP = this.wpDb.createQueryRunner();

    await queryRunner.connect();
    await queryRunnerWP.connect();

    try {
      await queryRunnerWP.startTransaction(); // 🔹 Inicia la transacción

      const municipios = await queryRunner.query('SELECT * FROM municipio');
      // console.log(municipios, 'Municipios');

      for (const element of municipios) {
        // 🔹 Usa `for...of` en lugar de `forEach`
        const name = await queryRunnerWP.query(
          `SELECT * FROM w47fa_terms AS terms WHERE terms.name = ?`,
          [element.nombre],
        );
        // console.log(name, 'Municipio');

        if (name.length === 0) {
          const insertQuery = `
          INSERT INTO w47fa_terms (name, slug, term_group)
          VALUES (?, ?, 0)`;

          const result: any = await queryRunnerWP.query(insertQuery, [
            element.nombre,
            this.normalizeText(element.nombre),
          ]);

          const insertQuery2 = `
          INSERT INTO w47fa_term_taxonomy (term_id, taxonomy, description, parent, count)
          VALUES (?, 'property_province', '', 0, 0)`;

          await queryRunnerWP.query(insertQuery2, [result.insertId]); // 🔹 Usa `insertId`
        }
      }

      await queryRunnerWP.commitTransaction(); // 🔹 Confirma la transacción
    } catch (error) {
      await queryRunnerWP.rollbackTransaction(); // 🔹 Revierte cambios en caso de error
      console.error('Error en la inserción:', error);
    } finally {
      await queryRunner.release();
      await queryRunnerWP.release(); // 🔹 Libera el queryRunner al final
    }
  }

  //  Repartos
  async insertNeighborhood() {
    const queryRunner = this.sourceDb.createQueryRunner();
    const queryRunnerWP = this.wpDb.createQueryRunner();

    await queryRunner.connect();
    await queryRunnerWP.connect();

    try {
      await queryRunnerWP.startTransaction(); // 🔹 Inicia la transacción

      const repartos = await queryRunner.query('SELECT * FROM reparto');
      // console.log(repartos, 'Repartos');

      for (const element of repartos) {
        // 🔹 Usa `for...of` en lugar de `forEach`
        const name = await queryRunnerWP.query(
          `SELECT * FROM w47fa_terms AS terms WHERE terms.name = ?`,
          [element.nombre],
        );
        // console.log(name, 'Reparto');

        if (name.length === 0) {
          const insertQuery = `
          INSERT INTO w47fa_terms (name, slug, term_group)
          VALUES (?, ?, 0)`;

          const result: any = await queryRunnerWP.query(insertQuery, [
            element.nombre,
            this.normalizeText(element.nombre),
          ]);

          const insertQuery2 = `
          INSERT INTO w47fa_term_taxonomy (term_id, taxonomy, description, parent, count)
          VALUES (?, 'property_city', '', 0, 0)`;

          await queryRunnerWP.query(insertQuery2, [result.insertId]); // 🔹 Usa `insertId`
        }
      }

      await queryRunnerWP.commitTransaction(); // 🔹 Confirma la transacción
    } catch (error) {
      await queryRunnerWP.rollbackTransaction(); // 🔹 Revierte cambios en caso de error
      console.error('Error en la inserción:', error);
    } finally {
      await queryRunner.release();
      await queryRunnerWP.release(); // 🔹 Libera el queryRunner al final
    }
  }

  // Función para normalizar el texto
  normalizeText = (text: string) => {
    return text
      .normalize('NFD') // Separa caracteres con tilde (ej: "á" → "a" + "́")
      .replace(/[\u0300-\u036f]/g, '') // Elimina los diacríticos (tildes)
      .toLowerCase() // Convierte todo a minúsculas
      .replace(/\s+/g, '-') // Reemplaza los espacios por "-"
      .replace(/-+$/g, ''); // Elimina guiones extra al final
  };
}

// function serializePhpArray(data: { add_feature_label: string; add_feature_value: string }[]): string {
//     let serialized = `a:${data.length}:{`;

//     data.forEach((item, index) => {
//         serialized += `i:${index};a:2:{`;
//         serialized += `s:17:"add_feature_label";s:${item.add_feature_label.length}:"${item.add_feature_label}";`;
//         serialized += `s:17:"add_feature_value";s:${item.add_feature_value.length}:"${item.add_feature_value}";`;
//         serialized += `}`;
//     });

//     serialized += "}";

//     return serialized;
// }
