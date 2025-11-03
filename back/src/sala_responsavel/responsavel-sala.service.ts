import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { Sala_Responsavel , Prisma } from "generated/prisma";
import { CreateResponsavelSalaDto } from "./create-responsavel-sala.dto";


@Injectable()
export class ResposavelSalaService{
    constructor(private prisma : PrismaService){}

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
            throw new BadRequestException('documento ja existente')
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
            return {message : 'Responsavel Criado'} 
        } catch (error){
            return {message : error.message}
        }
    }
    async editResponsavel(data : CreateResponsavelSalaDto):Promise<{message : string}>{
            console.log(data);
            if (!data.id){
                throw new BadRequestException('Id do responsavel nao prenchido')
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
                return {message : 'Responsavel Alterado'}
            } catch (error){
                console.log(error)
                return {message : 'erro na edicao'}
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
                await this.prisma.sala_Responsavel.delete({
                    where : {id : responsavel.id}
                })
                return {message : `responsavel deletado`}
            }catch(error){
                console.log(error);
                return {message : `erro interno`}
            }

        }else {
            throw new BadRequestException('responsavel nao encontrado') 
        }
    }
}