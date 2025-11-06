import { BadRequestException, Injectable  } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { Feriado, Prisma } from "generated/prisma";
import { CreateFeriadoDto } from "./create-feriado.dto";

@Injectable()
export class FeriadoService{
    constructor(private prisma : PrismaService){}
    
    async isFeriado(date : Date):Promise<boolean>{
        const feriado = await this.prisma.feriado.findFirst({
            where : {data : date}
        })
        return feriado ? true : false;
    }


    async createFeriado(data : Prisma.FeriadoCreateInput):Promise<{message : string}>{
        try {
            await this.prisma.feriado.create({data});
            return {message : 'feriado criado'}
        } catch (error) {
            return {message : 'error'}
        }
    }

    async getAllFeriados():Promise<Feriado[]>{
        try {
            return await this.prisma.feriado.findMany();
        } catch (error) {
            return error
        }
    }

    async editFeriado(data : CreateFeriadoDto):Promise<{message : string}>{
        if (!data.id_feriado){
            throw new BadRequestException('Id do feriado nao prenchido')
        }
        try {
            const feriado = await this.prisma.feriado.findFirst({
                where : {id : data.id_feriado}
            }) 
            if(feriado){
                await this.prisma.feriado.update({
                    where : {id : feriado.id},
                    data : {
                        data : new Date(data.data),
                        descricao : data.descricao,
                        tipo : data.tipo ,
                        ativo : data.ativo,
                    }
                })
            }
            return {message : 'Feriado alterado com sucesso'}
        } catch (error){
            console.log('Erro na criação do feriado' , error)
            return {message : 'Erro na criação do feriado'}
        }
    }

    async deleteFeriado(feriadoId : number):Promise<{message: string}>{
        feriadoId = Number(feriadoId);
        if (feriadoId === null){
            throw new BadRequestException('Id não fornecido')
        }
        const feriado = await this.prisma.feriado.findFirst({
            where : {id : feriadoId}
        }) 

        if(feriado){
            try {
                await this.prisma.feriado.delete({
                    where : {id : feriado.id}
                })
                return {message : `Feriado deletado com sucesso`}
            }catch(error){
                console.log(error , `erro deletando feriado interno`);
                return {message : `erro deletando feriado interno`}
            }

        }else {
            throw new BadRequestException('Feriado não encontrado') 
        }
    }
}