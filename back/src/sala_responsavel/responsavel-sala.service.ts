import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { Sala_Responsavel , Prisma, Sala } from "generated/prisma";
import { CreateResponsavelSalaDto } from "./create-responsavel-sala.dto";
import { SalaService } from "src/sala/sala.service";


@Injectable()
export class ResposavelSalaService{
    constructor(private prisma : PrismaService , 
                @Inject(forwardRef(() => SalaService))
                private salaService : SalaService){}
    async verifyResponsavelExist(responsavel_id : number) : Promise<boolean>{
        const responsavel = await this.prisma.sala_Responsavel.findUnique(
            {
                where : {id : responsavel_id}
            }
        ) 
        return !!responsavel
    }
    async getAllResponsaveis() : Promise<Sala_Responsavel[]>{
        const responsaveis = await this.prisma.sala_Responsavel.findMany();
        return responsaveis;
    }
    async createResponsavelSala(data : Prisma.Sala_ResponsavelCreateInput):Promise<{message : string}>{
        console.log(data);
        const responsavel = await this.prisma.sala_Responsavel.findFirst(
            {
                where : {documento  : data.documento}
            }
        )
        if (responsavel){
            throw new BadRequestException('Documento ja existente')
        }

        try {
            await this.prisma.sala_Responsavel.create({
                data : {
                    nome : data.nome,
                    documento : data.documento,
                    valido_de : new Date(data.valido_de),
                    valido_ate : data.valido_ate ? new Date(data.valido_ate) : null,
                    ativo : true,
                }
            })
            return {message : 'Responsavel criado com sucesso'} 
        } catch (error){
            return {message : error.message}
        }
    }
    async editResponsavel(data : CreateResponsavelSalaDto):Promise<{message : string}>{
            if (!data.id){
                throw new BadRequestException('Id do responsavel nulo')
            }
            try {
                const responsavel = await this.prisma.sala_Responsavel.findFirst({
                    where : {id : data.id}
                }) 
                if(responsavel){
                    await this.prisma.sala_Responsavel.update({
                        where : {id : responsavel.id},
                        data : {
                            nome : data.nome,
                            valido_ate : data.valido_ate,
                            ativo : true
                        }
                    })
                }
                return {message : 'Responsavel alterado com sucesso'}
            } catch (error){
                console.log(`erro na edicao de responsavel ` , error)
                return {message : 'erro na edicao de responsavel'}
            }
        }
    async deleteResponsavel(responsavelId : number):Promise<{message: string}>{
        responsavelId = Number(responsavelId);
        if (responsavelId === null){
            throw new BadRequestException('id nao fornecido')
        }
        const responsavel = await this.prisma.sala_Responsavel.findFirst({
            where : {id : responsavelId}
        }) 

        if(responsavel){
            try {
                //limpa todos os campos de sala:responsavel_id antes de excluir o responsavel
                await this.salaService.desatributeEachResponsavelInSalas(responsavel.id);
                
                await this.prisma.sala_Responsavel.delete({
                    where : {id : responsavel.id}
                })
                return {message : `Responsavel deletado som sucesso`}
            }catch(error){
                console.log(`erro deletando responsavel` , error);
                return {message : `erro deletando responsavel`}
            }

        }else {
            throw new BadRequestException('Responsavel não encontrado') 
        }
    }

}