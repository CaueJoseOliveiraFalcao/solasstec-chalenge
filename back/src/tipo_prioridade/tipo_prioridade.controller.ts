import { Controller , Body , Post , Get } from "@nestjs/common";
import { TipoPrioridadeService } from "./tipo_prioridade.service";
import { Tipo_Prioridade } from "generated/prisma";
import { CreateTipoPrioridadeDTO } from "./create-tipo-prioridade.dto";
@Controller('tipo-prioridade')
    export class TipoPrioridadeController{
        constructor(private readonly tipoPrioridadeService : TipoPrioridadeService){}

        @Post()
        async create(@Body() crateDto : CreateTipoPrioridadeDTO):Promise<Tipo_Prioridade | undefined> {
            console.log(crateDto);
            const response = this.tipoPrioridadeService.createTipoPrioridade(crateDto);
            return response;
        }
    }