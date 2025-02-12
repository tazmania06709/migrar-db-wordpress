import { Controller, Get, Param, Post } from '@nestjs/common';
import { MigrationsService } from './migrations.service';
// import { CreateMigrationDto } from './dto/create-migration.dto';
// import { UpdateMigrationDto } from './dto/update-migration.dto';

@Controller('migrations')
export class MigrationsController {
  constructor(private readonly migrationsService: MigrationsService) {}

  // @Post()
  // create(@Body() createMigrationDto: CreateMigrationDto) {
  //   return this.migrationsService.create(createMigrationDto);
  // }

  @Get('properties')
  async migrateInmuebles() {
    return await this.migrationsService.getInmuebles();
  }

  @Get()
  findAll() {
    return this.migrationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.migrationsService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMigrationDto: UpdateMigrationDto) {
  //   return this.migrationsService.update(+id, updateMigrationDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.migrationsService.remove(+id);
  // }

  @Post('province')
  async migrateProvince() {
    return this.migrationsService.insertProvince();
  }
  @Post('municipalities')
  async migrateMunicipalities() {
    return this.migrationsService.insertMunicipalities();
  }
  @Post('neighborhood')
  async migrateNeighborhood() {
    return this.migrationsService.insertNeighborhood();
  }
}
