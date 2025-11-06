import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateAcessoDto } from './create-acesso.dto';
import { Acesso } from 'generated/prisma';

@Injectable()
export class AcessoService {
  constructor(private prisma: PrismaService) {}

  async acessoExist (id:number):Promise<boolean> {
    const acesso = this.prisma.acesso.findUnique({
        where : {agendamento_id : id}
    })

    return !!acesso;
  }
  async registrarEntrada(data: { acessCode: string }): Promise<Acesso | { message: string }> {
    const acesso = await this.prisma.acesso.findFirst({
      where: { code: data.acessCode },
    });

    if (!acesso) {
      return { message: 'Acesso não encontrado' };
    }

    if(acesso.entrada_em === null){
      const atualizado = await this.prisma.acesso.update({
        where : {id : acesso.id},
        data : {
          entrada_em : new Date()
        }
      })
      return atualizado

    }else if(acesso.saida_em === null){
      const atualizado = await this.prisma.acesso.update({
        where : {id : acesso.id},
        data : {
          saida_em : new Date()
        }
      })
      return atualizado
    }else{
      return {message : `visitante validado na entrada : ${acesso.entrada_em} e saia ${acesso.saida_em}`}
    }

  }

  async create(data: CreateAcessoDto) {
    if(await this.acessoExist(data.agendamento_id)){throw new BadRequestException('Acesso ja criado')}
    if (!data.code) {
      throw new BadRequestException('Campo "code" é obrigatório');
    }

    return this.prisma.acesso.create({
      data: {
        visitante_id: data.visitante_id,
        sala_id: data.sala_id,
        agendamento_id: data.agendamento_id,
        entrada_em: data.entrada_em,
        saida_em: data.saida_em,
        ativo: data.ativo ?? true,
        code : data.code!,
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
