import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateAgendamentoDto } from "./create-agendamento.dto";
import { randomUUID } from "crypto";
import { FeriadoService } from "src/feriado/feriado.service";
import { SalaService } from "src/sala/sala.service";
import { VerifyAgendamentoDataDto } from "./verify-agendamento-data.dto";
import { AgendamentoAuditoriaService } from "src/agendamento_auditoria/agendamento.service";
import { Agendamento } from "generated/prisma";
import { VisitanteService } from "src/visitante/visitante.service";
import { AcessoService } from "src/acesso/acesso.service";

@Injectable()
export class AgendamentoService {
  constructor(
    private prisma: PrismaService,
    private feriadoService: FeriadoService,
    private salaService: SalaService,
    private acessoService : AcessoService
  ) {}
  async getAllAgendamentos():Promise<Agendamento[]>{
    return this.prisma.agendamento.findMany(
      {
        include : {
          sala : true,
          visitante : true,
          acesso : true
        }
      }
    );
  }
  async validateAgendamentoData(dataAgendamento :Date , sala_id : number):Promise<Date> {


        while (true) {
          if(await this.feriadoService.isFeriado(dataAgendamento)){
            dataAgendamento.setUTCDate(dataAgendamento.getUTCDate() + 1);
            continue;
          }
          if(!(await this.salaService.isSalaActiveOnDate(sala_id , dataAgendamento))){
            dataAgendamento.setUTCDate(dataAgendamento.getUTCDate() + 1);
            continue;
          }
          return dataAgendamento;
          ;
        }
  
  }
  async validateIsFeriadoOrClosed(data: VerifyAgendamentoDataDto): Promise<{message : string , action : string , data : any} | void> {
    const [year, month, day] = data.data_agendada.split('-').map(Number);
    const dataAgendadaCopia = new Date(Date.UTC(year, month - 1, day));
    const dataAgendada = new Date(Date.UTC(year, month - 1, day));

    //enquanto o dia da semana escolhido for feriado ou loja fechada ele adiciona proximo dia
    const dataSemFeriadoEAberto = await this.validateAgendamentoData(dataAgendada , data.sala_id);

    if (dataSemFeriadoEAberto.getTime() !== dataAgendadaCopia.getTime()){
        const dataSemFeriadoEAbertoFomatado = 
        `${dataSemFeriadoEAberto.getUTCFullYear()}-${((dataSemFeriadoEAberto.getUTCMonth() + 1).toString().padStart(2 , '0'))}-${dataSemFeriadoEAberto.getUTCDate().toString().padStart(2 , '0')}`;
        return {
            message : `Data Agendada em Feriado ou Sala Fechada, novo agendamento para ${dataSemFeriadoEAberto}`,
            action : 'insertNewDateAutomaticly',
            data : dataSemFeriadoEAbertoFomatado,
        }
    }
  }
  async createAgendamento(data: CreateAgendamentoDto): Promise<{ message: string}> {
    const [year, month, day] = data.data_agendada.split('-').map(Number);
    const dataAgendada = new Date(Date.UTC(year, month - 1, day));

    const validate = await this.validateIsFeriadoOrClosed(data);
    if (validate){
        return validate;
    }
    const agendamentosDoVisitante = await this.prisma.agendamento.findMany({
      where: {
        visitante_id: data.visitante_id,
        data_agendada: dataAgendada,
      },
    });

    for (const agendamento of agendamentosDoVisitante) {
      const inicioExistente = this.converterHoraParaMinutos(agendamento.hora_inicio);
      const fimExistente = this.converterHoraParaMinutos(agendamento.hora_fim);
      const inicioNovo = this.converterHoraParaMinutos(data.hora_inicio);
      const fimNovo = this.converterHoraParaMinutos(data.hora_fim);

      const sobrepoe =
        (inicioNovo >= inicioExistente && inicioNovo < fimExistente) ||
        (fimNovo > inicioExistente && fimNovo <= fimExistente) ||
        (inicioNovo <= inicioExistente && fimNovo >= fimExistente);

      if (sobrepoe) {
        throw new BadRequestException(
          'Visitante já possui um agendamento nesse horário'
        );
      }
    }
    const novoAgendamento = await this.prisma.agendamento.create({
        data: {
            visitante_id: data.visitante_id,
            sala_id: data.sala_id,
            data_agendada: dataAgendada,
            hora_inicio: data.hora_inicio,
            hora_fim: data.hora_fim,
            status : 1,
            code: randomUUID(),
        }
    });
    await this.prisma.agendamento_Auditoria.create({
      data: {
        visitante_id: novoAgendamento.visitante_id,
        sala_id: novoAgendamento.sala_id,
        data_agendada: novoAgendamento.data_agendada,
        hora_inicio: novoAgendamento.hora_inicio,
        hora_fim: novoAgendamento.hora_fim,
        code: novoAgendamento.code,
      },
    });
    await this.prisma.acesso.create({
      data: {
        visitante_id: novoAgendamento.visitante_id,
        sala_id: novoAgendamento.sala_id,
        agendamento_id: novoAgendamento.id,
        entrada_em: null,
        saida_em: null,
        ativo: true,
        code : novoAgendamento.code
      },
    });
    return {message : 'agendamento criado'}
  }
  async vefiyAgendamentoDataAndReturnAvalibleHours(data : VerifyAgendamentoDataDto):Promise<any>{
    const validate = await this.validateIsFeriadoOrClosed(data);
    if (validate){
        return validate;
    }
     const horasDia = await this.salaService.getHourOfThisDay(data.data_agendada, data.sala_id);
      const { init, end } = horasDia;


      const agendamentosOcupados = await this.getAgendamentosOucupadosNaData(data.sala_id, data.data_agendada);
      const horariosLivres = await this.calculaHorasLivres(init, end, agendamentosOcupados);


      return {
        init : horasDia.init,
        end : horasDia.end,
        livre : horariosLivres,
      }
    }
  async calculaHorasLivres(init: string,end: string, agendamentosOcupados : any): Promise<any>{
      const toMinutes = (time: string) => {
        const [h, m] = time.split(':').map(Number);
        return h * 60 + m;
      };
      const toHourStr = (min: number) =>
        `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

      const ocupadosOrdenados = agendamentosOcupados.sort(
        (a, b) => toMinutes(a.inicio) - toMinutes(b.inicio)
      );

      const livre: { inicio: string; fim: string }[] = [];
      let atual = toMinutes(init);
      const fimDia = toMinutes(end);

      for (const ag of ocupadosOrdenados) {
        const inicioAg = toMinutes(ag.inicio);
        const fimAg = toMinutes(ag.fim);

        if (inicioAg > atual) {
          livre.push({ inicio: toHourStr(atual), fim: toHourStr(inicioAg) });
        }

        if (fimAg > atual) {
          atual = fimAg;
        }
      }

      if (atual < fimDia) {
        livre.push({ inicio: toHourStr(atual), fim: toHourStr(fimDia) });
      }
      return livre;
  }
async getAgendamentosOucupadosNaData(salaId : number , dataAgendadaStr : string):Promise<any[]>{
      const [year, month, day] = dataAgendadaStr.split('-').map(Number);

      const agendamentosExistentes = await this.prisma.agendamento.findMany({
        where: {
          sala_id: salaId,
          data_agendada : new Date(Date.UTC(year, month - 1, day, 0, 0, 0)),
        },
        select: {
          hora_inicio: true,
          hora_fim: true,
        },
      });
      const horariosOcupados = agendamentosExistentes.map(a => ({
        inicio: a.hora_inicio,
        fim: a.hora_fim,
      }));
      return horariosOcupados;
  }
private converterHoraParaMinutos(hora: string): number {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
}

}