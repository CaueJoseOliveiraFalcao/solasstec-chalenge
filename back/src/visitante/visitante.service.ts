import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Visitante , Prisma } from "generated/prisma";
import { CreateVisitanteDto } from "./create-visitante.dto";
import { TipoPrioridadeService } from "src/tipo_prioridade/tipo_prioridade.service";
import { AgendamentoService } from "src/agendamento/agendamento.service";
@Injectable()
export class VisitanteService {
    constructor(private prisma : PrismaService , 
        private tipoPrioridadeService : TipoPrioridadeService,
        @Inject(forwardRef(() => AgendamentoService))
        private agedamentoService : AgendamentoService
    ) {}

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
    async deleteVisitant(ToDeleteId: string): Promise<any> {
        try {
            const visitante = await this.prisma.visitante.findUnique({
            where: { id: Number(ToDeleteId) },
            include: { Agendamentos: true },
            });

            if (!visitante) {
            throw new BadRequestException('Visitante não encontrado');
            }

            const agendamentosDoVisitante = visitante.Agendamentos;

            if (agendamentosDoVisitante.length > 0) {
                for (const agendamento of agendamentosDoVisitante) {
                const acesso = await this.prisma.acesso.findFirst({
                    where: { agendamento_id: agendamento.id },
                });

   
                if (acesso) {
                    await this.prisma.acesso.delete({
                    where: { id: acesso.id },
                    });
                }

                await this.prisma.agendamento.delete({
                    where: { id: agendamento.id },
                });
                }
            }
            if (visitante.tipo_prioridade_id) {
            await this.prisma.tipo_Prioridade.delete({
                where: { id: visitante.tipo_prioridade_id },
            });
            }

            await this.prisma.visitante.delete({
            where: { id: visitante.id },
            });
        } catch (error) {
            console.log('em deletar visitante : ' , error);
            return error;
        }
    }

    async createVisitante(data:CreateVisitanteDto):Promise<Visitante | undefined>{
        let tipoIdCriado : number | undefined = 0;

        const documentExist = await this.getUserByDocument(data.documento);
        if(documentExist){throw new BadRequestException('Já existe um visitante com este documento')}

        //caso visitante seja prioridade
        if (data.is_tipo_prioridade){
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
    async editVisitante(data: CreateVisitanteDto): Promise<Visitante | undefined> {

    const visitante = await this.prisma.visitante.findUnique({
        where: { id: data.id },
    });

    if (!visitante){
        console.log(`Editando visitante : id nao encontrado`)
        return undefined
    };

    const editedVisitante = await this.prisma.$transaction(async (prisma) => {
        let tipoPrioridadeId = visitante.tipo_prioridade_id;

        //visitante tem uma prioridade ativa e quer deletar ela
        if (visitante.tipo_prioridade_id && !data.is_tipo_prioridade) {
            await prisma.tipo_Prioridade.delete({
                where: { id: visitante.tipo_prioridade_id },
            });
            tipoPrioridadeId = null;
        }

        
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
