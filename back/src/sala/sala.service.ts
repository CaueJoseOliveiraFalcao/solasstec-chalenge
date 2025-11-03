import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { Sala , Prisma } from "generated/prisma";
import { CreateSalaDto } from "./create-sala.dto";


@Injectable()
export class SalaService{
    constructor(private prisma : PrismaService){}


    async createSala(data : Prisma.SalaCreateInput):Promise<{message : string}>{
        console.log(data);
        return {message : 'foi'} 
    }
}