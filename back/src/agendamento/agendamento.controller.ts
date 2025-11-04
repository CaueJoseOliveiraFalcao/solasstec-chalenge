import { Body, Controller, Post } from "@nestjs/common";
import { AgendamentoService } from "./agendamento.service";
import { CreateAgendamentoDto } from "./create-agendamento.dto";

@Controller('agendamento')
export class AgendamentoController {
    constructor(private readonly agendamentoService: AgendamentoService){}

    @Post()
    async createAgendamento(@Body() data : CreateAgendamentoDto):Promise<{message : string}>{
        return await this.agendamentoService.createAgendamento(data);
    }
}