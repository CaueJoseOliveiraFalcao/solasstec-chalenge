import { Controller , Body , Post , Get } from "@nestjs/common";
import { FeriadoService } from "./feriado.service";
import { CreateFeriadoDto } from "./create-feriado.dto";
@Controller('feriado')
    export class FeriadoController{
        constructor(private readonly feriadoService : FeriadoService){}

        @Post()
        async create(@Body() crateDto : CreateFeriadoDto):Promise<{message : string}> {
            const response = this.feriadoService.createFeriado(crateDto);
            return {message : 'feriado adicionado'};
        }

    }