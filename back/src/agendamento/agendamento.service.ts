import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateAgendamentoDto } from "./create-agendamento.dto";
import { randomUUID } from "crypto";
import { FeriadoService } from "src/feriado/feriado.service";
import { SalaService } from "src/sala/sala.service";

@Injectable()
export class AgendamentoService {
  constructor(
    private prisma: PrismaService,
    private feriadoService: FeriadoService,
    private salaService: SalaService,
  ) {}
  async createAgendamento(data: CreateAgendamentoDto): Promise<{ message: string , data?: any , action ?: string}> {
    const [year, month, day] = data.data_agendada.toString().split('-').map(Number);
    const dataAgendada = new Date(year, month - 1, day);
    dataAgendada.setHours(0, 0, 0, 0);


    //se a data agendada for feriado roda ate achar a proxima data valida
    const feriado = await this.feriadoService.isFeriado(new Date(data.data_agendada));
    if (feriado){

        let nextDate = await this.feriadoService.getNextDisponibleDate((dataAgendada));
        const formatedNextData = 
        `${nextDate.getUTCFullYear()}-${((nextDate.getUTCMonth() + 1).toString().padStart(2 , '0'))}-${nextDate.getUTCDate().toString().padStart(2 , '0')}`;
       return {
        message : `A Data : ${dataAgendada.toLocaleDateString()}  agendada cai em um feriado` , 
        data : formatedNextData , 
        action : 'insertNewDateAutomaticly'};
    }

    const diasMap = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];

    const diaDaSemanaEscolhido = diasMap[dataAgendada.getUTCDay()];
    const diaAtivo = await this.salaService.isSalaActiveOnDate(data.sala_id , diaDaSemanaEscolhido);
    await this.prisma.agendamento.create({
        data: {
            visitante_id: data.visitante_id,
            sala_id: data.sala_id,
            data_agendada: new Date(data.data_agendada),
            hora_inicio: data.hora_inicio,
            hora_fim: data.hora_fim,
            code: randomUUID(),
        }
    });
    return {message : 'agendamento criado'}
  }


}