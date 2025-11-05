import { Body, Controller, Get, Post } from "@nestjs/common";
import { AgendamentoService } from "./agendamento.service";
import { CreateAgendamentoDto } from "./create-agendamento.dto";
import { Agendamento } from "generated/prisma";

@Controller('agendamento')
export class AgendamentoController {
    constructor(private readonly agendamentoService: AgendamentoService){}

    @Get()
    async getAllAgendamentos():Promise<Agendamento[]>{
        return this.agendamentoService.getAllAgendamentos();
    }
    @Post()
    async createAgendamento(@Body() data : CreateAgendamentoDto):Promise<{message : string}>{
        return await this.agendamentoService.createAgendamento(data);
    }
    @Post('available-hours')
    async getAvailableHours(@Body() data : any):Promise<string[]>{
        return await this.agendamentoService.vefiyAgendamentoDataAndReturnAvalibleHours(data);
    }
}