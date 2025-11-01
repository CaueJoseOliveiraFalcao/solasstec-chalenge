import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Visitante , Prisma } from "generated/prisma";
import { CreateVisitanteDto } from "./create-visitante.dto";
import { TipoPrioridadeService } from "src/tipo_prioridade/tipo_prioridade.service";
@Injectable()
export class VisitanteService {
    constructor(private prisma : PrismaService , private tipoPrioridadeService : TipoPrioridadeService) {}


    async createVisitante(data:CreateVisitanteDto):Promise<Visitante | undefined>{
        let tipoIdCriado : number | undefined = 0;

        if (data.documento.length != 11){
            throw new BadRequestException('documento invalido');
        }
        const documentExist = await this.getUserByDocument(data.documento);
        if(documentExist){
            throw new BadRequestException('documento ja existe')
        }


        if (data.is_tipo_prioridade){
            if (!data.descricao || data.nivel_prioridade === undefined){
                    throw new BadRequestException('Informacoes relacionada a Priorioridade em falta')
                }
            const tipoCriado = await this.tipoPrioridadeService.createTipoPrioridade({
                    descricao : data.descricao!,
                    nivel_prioridade : data.nivel_prioridade!,
                    ativo : true
            });
                tipoIdCriado = tipoCriado?.id
            }
            if (tipoIdCriado != 0){
                return await this.prisma.visitante.create({
                    data: {
                    nome: data.nome,
                    documento: data.documento,
                    phone: data.phone,
                    data_nascimento: new Date(data.data_nascimento),
                    foto: data.foto,
                    ativo: data.ativo,
                    tipo_prioridade_id: tipoIdCriado,
                    },
                });
            }
            return await this.prisma.visitante.create({
                    data: {
                    nome: data.nome,
                    documento: data.documento,
                    phone: data.phone,
                    data_nascimento: new Date(data.data_nascimento),
                    foto: data.foto,
                    ativo: data.ativo,
                },
            });
        }
        catch (error : any) {   
            throw error;

        }

    
    async getUserByDocument(document: string):Promise<boolean> {
        const getUser = await this.prisma.visitante.findFirst(({
            where : {documento : document},
        }));

        return !!getUser;
    }
}
