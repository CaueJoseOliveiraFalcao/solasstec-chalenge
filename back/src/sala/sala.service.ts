import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { Sala , Prisma } from "generated/prisma";
import { CreateSalaDto } from "./create-sala.dto";
import { ResposavelSalaService } from "src/sala_responsavel/responsavel-sala.service";

@Injectable()
export class SalaService{
    constructor(
        private prisma : PrismaService ,
        @Inject(forwardRef(() => ResposavelSalaService))
        private responsavelService : ResposavelSalaService){}

    async desatributeEachResponsavelInSalas(responsavel_id : number):Promise<void>{
        try {        
            await this.prisma.sala.updateMany({
            where : {responsavel_id : responsavel_id},
            data : {responsavel_id : null}
        })
        } catch (error) {
            throw new BadRequestException('Erro na exclusao de responsavelId em Sala');
        }

    }
    async nameExists(name : string):Promise<boolean>{
        const sala = await this.prisma.sala.findFirst({
            where:{nome : name}
        }) 
        return !!sala
    }
    async createSala(data : CreateSalaDto):Promise<{message : string}>{
        const DuplicateName = await this.nameExists(data.nome);
        if(DuplicateName) {throw new ConflictException('Nome ja Existe')};
    
        if(data.responsavel_id){
            const VerifyResponsavelExist = await this.responsavelService.verifyResponsavelExist(Number(data.responsavel_id))
            if (!VerifyResponsavelExist) {throw new NotFoundException('Responsavel Nao existe')}
        }
        try {
            const newSala = await this.prisma.sala.create({
                data : {
                    nome : data.nome,
                    capacidade : data.capacidade,
                    disponibilidade : data.disponibilidade,
                    responsavel_id : data.responsavel_id ? data.responsavel_id : null,
                    variacao_capacidade : data.variacao_capacidade,
                    ativo : true,
                }
            });
            return {message : 'Sala Criada'}
        } catch (error) {
            console.log(error);
            return {message : error.message}
        }
    }

}