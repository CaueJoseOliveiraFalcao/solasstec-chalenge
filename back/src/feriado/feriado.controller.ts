import { Controller , Body , Post , Get, Delete , Param } from "@nestjs/common";
import { FeriadoService } from "./feriado.service";
import { CreateFeriadoDto } from "./create-feriado.dto";
import { Feriado } from "generated/prisma";
@Controller('feriado')
    export class FeriadoController{
        constructor(private readonly feriadoService : FeriadoService){}

        @Post()
        async create(@Body() crateDto : CreateFeriadoDto):Promise<{message : string}> {
            const response = this.feriadoService.createFeriado(crateDto);
            return {message : 'feriado adicionado'};
        }

        @Get()
        async getAllFeriados():Promise<Feriado[]>{
            return await this.feriadoService.getAllFeriados()
        }

        @Post('edit')
        async edit(@Body() data : CreateFeriadoDto):Promise<{message : string}>{
            return await this.feriadoService.editFeriado(data);
        }
        @Delete(':feriadoId')
        async deleteFeriado(@Param('feriadoId') feriadoId : number):Promise<{message : string}>{
            return await this.feriadoService.deleteFeriado(feriadoId);
        }

    }