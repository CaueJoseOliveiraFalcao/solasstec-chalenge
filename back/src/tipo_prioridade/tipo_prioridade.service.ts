import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { Tipo_Prioridade , Prisma } from "generated/prisma";


@Injectable()
    export class TipoPrioridadeService{
        constructor(private prisma : PrismaService){}

    async createTipoPrioridade(data : Prisma.Tipo_PrioridadeCreateInput): Promise<Tipo_Prioridade | undefined>{
        return await this.prisma.tipo_Prioridade.create({ data });
    }
    async getAllTipoPrioridade() : Promise<Tipo_Prioridade[]> {
        return await this.prisma.tipo_Prioridade.findMany();
    }
    }

