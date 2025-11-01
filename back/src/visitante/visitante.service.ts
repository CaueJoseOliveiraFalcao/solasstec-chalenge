import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Visitante , Prisma } from "generated/prisma";
import { IsNotEmpty } from "class-validator";

@Injectable()
export class VisitanteService {
    constructor(private prisma : PrismaService) {}


    async createVisitante(data:Prisma.VisitanteCreateInput):Promise<Visitante>{
        return this.prisma.visitante.create({data});
    }
}