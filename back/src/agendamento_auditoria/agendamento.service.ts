import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateAgendamentoAuditoriaDto } from './create-agendamento.dto';

@Injectable()
export class AgendamentoAuditoriaService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAgendamentoAuditoriaDto) {
    // Validação opcional: garantir que hora_inicio < hora_fim
    const toMinutes = (h: string) => {
      const [hour, min] = h.split(':').map(Number);
      return hour * 60 + min;
    };

    if (toMinutes(data.hora_inicio) >= toMinutes(data.hora_fim)) {
      throw new BadRequestException('Hora de início deve ser anterior à hora de fim.');
    }

    return this.prisma.agendamento_Auditoria.create({ data });
  }

}
