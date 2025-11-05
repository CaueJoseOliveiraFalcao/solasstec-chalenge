import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AgendamentoAuditoriaService } from './agendamento.service';
import { CreateAgendamentoAuditoriaDto } from './create-agendamento.dto';
@Controller('agendamento-auditoria')
export class AgendamentoAuditoriaController {
  constructor(private readonly service: AgendamentoAuditoriaService) {}

  @Post()
  create(@Body() dto: CreateAgendamentoAuditoriaDto) {
    return this.service.create(dto);
  }
}
