import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateSalaAuditoriaDto } from './create-sala-auditoria.dto';
@Injectable()
export class SalaAuditoriaService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSalaAuditoriaDto) {
    return await this.prisma.sala_Auditoria.create({
      data,
    });
  }
}
