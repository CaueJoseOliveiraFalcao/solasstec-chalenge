import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { SalaAuditoriaService } from './sala-auditoria.service';
import { CreateSalaAuditoriaDto } from './create-sala-auditoria.dto';
@Controller('sala-auditoria')
export class SalaAuditoriaController {
  constructor(private readonly salaAuditoriaService: SalaAuditoriaService) {}

  @Post()
  async create(@Body() data: CreateSalaAuditoriaDto) {
    return this.salaAuditoriaService.create(data);
  }
}
