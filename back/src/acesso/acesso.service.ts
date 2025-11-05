import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateAcessoDto } from './create-acesso.dto';

@Injectable()
export class AcessoService {
  constructor(private prisma: PrismaService) {}

  async acessoExist (id:number):Promise<boolean> {
    const acesso = this.prisma.acesso.findUnique({
        where : {agendamento_id : id}
    })

    return !!acesso;
  }

  async create(data: CreateAcessoDto) {
    if(await this.acessoExist(data.agendamento_id)){throw new BadRequestException('Acesso ja criado')}

    return this.prisma.acesso.create({
      data: {
        visitante_id: data.visitante_id,
        sala_id: data.sala_id,
        agendamento_id: data.agendamento_id,
        entrada_em: data.entrada_em,
        saida_em: data.saida_em,
        ativo: data.ativo ?? true,
      },
      include: {
        visitante: true,
        sala: true,
        agendamento: true,
      },
    });
  }

  async findAll() {
    return this.prisma.acesso.findMany({
      include: {
        visitante: true,
        sala: true,
        agendamento: true,
      },
    });
  }
  async validateAcess(data : string):Promise<{message : string}>{
    const acesso = this.prisma.agendamento.findFirst({
        where : {code : data}
    })
    console.log(acesso);
    return {message : `po`}
  }
}
