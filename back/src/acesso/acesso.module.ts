import { Module } from '@nestjs/common';
import { AcessoService } from './acesso.service';
import { AcessoController } from './acesso.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AcessoController],
  providers: [AcessoService, PrismaService],
  exports : [AcessoService]
})
export class AcessoModule {}
