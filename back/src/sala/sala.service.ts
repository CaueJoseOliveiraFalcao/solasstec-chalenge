import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { Sala , Prisma } from "generated/prisma";
import { CreateSalaDto } from "./create-sala.dto";
import { ResposavelSalaService } from "src/sala_responsavel/responsavel-sala.service";
import { UpdateSalaDto } from "./update-sala.dto";
import { SalaAuditoriaService } from "src/sala_auditoria/sala-auditoria.service";

@Injectable()
export class SalaService{
    constructor(
        private prisma : PrismaService ,
        @Inject(forwardRef(() => ResposavelSalaService))
        private responsavelService : ResposavelSalaService , 
        private salaAuditoriaService : SalaAuditoriaService){}

    async desatributeEachResponsavelInSalas(responsavel_id : number):Promise<void>{
        try {        
            await this.prisma.sala.updateMany({
            where : {responsavel_id : responsavel_id},
            data : {responsavel_id : null}
        })
        } catch (error) {
            throw new BadRequestException('Erro ao excluir o campo responsavelId da sala.');
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
        if(DuplicateName) {throw new ConflictException('Já existe uma sala com este nome.')};
    
        if(data.responsavel_id){
            const VerifyResponsavelExist = await this.responsavelService.verifyResponsavelExist(Number(data.responsavel_id))
            if (!VerifyResponsavelExist) {throw new NotFoundException('Responsavel Não existe')}
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
            return {message : 'Sala criada com sucesso'}
        } catch (error) {
            console.log(error);
            return {message : error.message}
        }
    }
    //revisar isso em visitant
    async getAllSalasWithResponsavel():Promise<any[]>{
        const allSalasWithResponse = await this.prisma.sala.findMany({
            include : { responsavel : true}
        })
        return allSalasWithResponse;
    }
    async deleteSala(salaId: number): Promise<void> {
        try {
        const sala = await this.prisma.sala.findUnique({
            where: { id: salaId },
            include: {
            Agendamentos: true,
            Acessos: true,
            auditorias: true,
            },
        });

        if (!sala) {
            throw new BadRequestException('Sala não encontrada');
        }

        await this.prisma.$transaction(async (tx) => {
            await tx.agendamento.deleteMany({ where: { sala_id: salaId } });
            await tx.acesso.deleteMany({ where: { sala_id: salaId } });
            await tx.sala_Auditoria.deleteMany({ where: { sala_id: salaId } });
            await tx.sala.delete({ where: { id: salaId } });
        });

        console.log(`Sala e seus registros relacionados foram deletados com sucesso`);
        } catch (error) {
        console.error('Erro ao deletar sala:', error);
        throw new BadRequestException('Erro ao deletar sala');
        }
}
    async editSalas(data : UpdateSalaDto):Promise<{message : string}>{
        const existingSala = await this.prisma.sala.findFirst({
            where: {
            nome: data.nome,
            },
        });
        if(data.responsavel_id){
            const VerifyResponsavelExist = await this.responsavelService.verifyResponsavelExist(Number(data.responsavel_id))
            if (!VerifyResponsavelExist) {throw new NotFoundException('Responsavel Nao existe')}
        }
        // o novo nome existe em outra sala que nao seja a sendo editada no momento
        if (existingSala && existingSala.id !== data.id) {
        throw new ConflictException('Já existe outra sala com este nome.');
        }

        const updatedSala = await this.prisma.sala.update({
            where: { id: data.id },
            data: {
                nome: data.nome,
                capacidade: data.capacidade,
                disponibilidade: data.disponibilidade,
                responsavel_id: data.responsavel_id || null,
            },
        });


        const existChangeDisponibilidade = 
        !!(data.alteracoes?.alteracoes_de_disponibilidade && 
            Object.entries(data.alteracoes.alteracoes_de_disponibilidade).length);

        const existChangeResponsavel =
        !!(data.alteracoes?.alteracoes_de_responsavel &&
            Object.entries(data.alteracoes.alteracoes_de_responsavel).length);
        //verifica se horario ou responsavel_Sala mudou
        if (existChangeDisponibilidade || existChangeResponsavel){
            await this.salaAuditoriaService.create({
            sala_id: data.id,
            responsavel_id: data.responsavel_id ?? null,
            alteracao: data.alteracoes,
            });
        }

        return { message: `Sala atualizada com sucesso.` };
        console.log(data)
    }
    async isSalaActiveOnDate(salaId : number , dataAgendada : Date):Promise<boolean>{
        const diasMap = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];
        const diaDaSemanaEscolhido = diasMap[dataAgendada.getUTCDay()];
        const sala = await this.prisma.sala.findFirst({
            where : {id : salaId}
        })
        const disponibilidadeObj = JSON.parse(String(sala?.disponibilidade));
         
        return disponibilidadeObj[diaDaSemanaEscolhido].open;
    }
    async getHourOfThisDay(dataAgendadaStr : string , salaId : number):Promise<{init : string , end : string}>{
        const diasMap = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];
        const [year, month, day] = dataAgendadaStr.split('-').map(Number);
        const dataAgendada = new Date(Date.UTC(year, month - 1, day));
        const diaDaSemanaEscolhido = diasMap[dataAgendada.getUTCDay()];

        const sala =  await this.prisma.sala.findFirst({
            where : {id : salaId}
        })
        if (sala){
          const salaDisponibilidade = JSON.parse(String(sala.disponibilidade))
            return { init: salaDisponibilidade[diaDaSemanaEscolhido].init, end: salaDisponibilidade[diaDaSemanaEscolhido].end};
        }
        return {init : '' , end : ''};
    }

}