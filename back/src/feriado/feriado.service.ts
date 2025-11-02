import { Injectable  } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { Feriado, Prisma } from "generated/prisma";

@Injectable()
export class FeriadoService{
    constructor(private prisma : PrismaService){}

    async createFeriado(data : Prisma.FeriadoCreateInput):Promise<{message : string}>{
        try {
            await this.prisma.feriado.create({data});
            return {message : 'feriado criado'}
        } catch (error) {
            return {message : 'error'}
        }
    }
}