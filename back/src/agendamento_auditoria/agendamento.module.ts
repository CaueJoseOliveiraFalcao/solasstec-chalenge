import { Module } from '@nestjs/common';
import { AgendamentoAuditoriaService } from './agendamento.service';
import { AgendamentoAuditoriaController } from './agendamento.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AgendamentoAuditoriaController],
  providers: [AgendamentoAuditoriaService, PrismaService],
  exports : [AgendamentoAuditoriaService]
})
export class AgendamentoAuditoriaModule {}
