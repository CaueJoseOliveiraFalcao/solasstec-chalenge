import { Module } from '@nestjs/common';
import { SalaAuditoriaController } from './sala-auditoria.controller';
import { SalaAuditoriaService } from './sala-auditoria.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [SalaAuditoriaController],
  providers: [SalaAuditoriaService, PrismaService],
  exports : [SalaAuditoriaService]
})
export class SalaAuditoriaModule {}
