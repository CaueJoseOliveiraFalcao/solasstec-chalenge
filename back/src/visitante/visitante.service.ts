import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Visitante , Prisma } from "generated/prisma";
import { CreateVisitanteDto } from "./create-visitante.dto";
import { TipoPrioridadeService } from "src/tipo_prioridade/tipo_prioridade.service";
@Injectable()
export class VisitanteService {
    constructor(private prisma : PrismaService , private tipoPrioridadeService : TipoPrioridadeService) {}

    async getAllVisitants() : Promise<Visitante[]>{
        const visitants = await this.prisma.visitante.findMany();
        return visitants;
    }

    async getUserByDocument(document: string):Promise<boolean> {
        const getUser = await this.prisma.visitante.findFirst(({
            where : {documento : document},
        }));

        return !!getUser;
    }
    async deleteVisitant(ToDeleteId : number):Promise<void> {
        ToDeleteId = Number(ToDeleteId)
        const visitante = await this.prisma.visitante.findUnique({
            where : {id : ToDeleteId}
        })

        if (!visitante) {
            throw new BadRequestException('Visitante não encontrado')
        }
        if (visitante.tipo_prioridade_id) {
            await this.prisma.tipo_Prioridade.delete({
                where: { id: visitante.tipo_prioridade_id },
            })
        }
        await this.prisma.visitante.delete({
            where: { id : ToDeleteId },
        })
    }
    async createVisitante(data:CreateVisitanteDto):Promise<Visitante | undefined>{
        let tipoIdCriado : number | undefined = 0;

        if (data.documento.length != 11){throw new BadRequestException('documento invalido');}

        const documentExist = await this.getUserByDocument(data.documento);
        if(documentExist){throw new BadRequestException('documento ja existe')}

        //caso checkbox prioridade for acionada
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
        }catch (error : any) {   
            throw error;
        }

async editVisitante(data: CreateVisitanteDto): Promise<Visitante | undefined> {
    if (!data.id) {
        throw new BadRequestException('Id não fornecido');
    }
    //ja tem ou quer cria uma prioridade , verifica os campos
    if (data.is_tipo_prioridade) {
        if (!data.descricao || data.nivel_prioridade === undefined) {
            throw new BadRequestException('Informações relacionadas à prioridade estão faltando');
        }
    }

    const visitante = await this.prisma.visitante.findUnique({
        where: { id: data.id },
    });

    if (!visitante) return undefined;

    //usa o transaction para lidar com todos os bancos de uma vez
    const editedVisitante = await this.prisma.$transaction(async (prisma) => {
        let tipoPrioridadeId = visitante.tipo_prioridade_id;

        // caso o usuario seja prioridade e queira sair
        if (visitante.tipo_prioridade_id && !data.is_tipo_prioridade) {
            await prisma.tipo_Prioridade.delete({
                where: { id: visitante.tipo_prioridade_id },
            });
            tipoPrioridadeId = null;
        }

        //caso ele queria atualizar sua prioridade
        if (visitante.tipo_prioridade_id && data.is_tipo_prioridade) {
            await prisma.tipo_Prioridade.update({
                where: { id: visitante.tipo_prioridade_id },
                data: {
                    descricao: data.descricao!,
                    nivel_prioridade: data.nivel_prioridade!,
                    ativo: true,
                },
            });
        }

        // caso ele nao tivesse prioridade e queira criar
        if (!visitante.tipo_prioridade_id && data.is_tipo_prioridade) {
            const newTipo = await prisma.tipo_Prioridade.create({
                data: {
                    descricao: data.descricao!,
                    nivel_prioridade: data.nivel_prioridade!,
                    ativo: true,
                },
            });
            tipoPrioridadeId = newTipo.id;
        }

        return prisma.visitante.update({
            where: { id: data.id },
            data: {
                nome: data.nome,
                phone: data.phone,
                data_nascimento: new Date(data.data_nascimento),
                ativo: data.ativo,
                tipo_prioridade_id: tipoPrioridadeId,
            },
        });
    });

    return editedVisitante;
}

}
