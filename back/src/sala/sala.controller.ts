import {Controller , Body , Post , Get } from "@nestjs/common";
import { CreateSalaDto } from "./create-sala.dto";
import { Sala , Prisma } from "generated/prisma";
import { SalaService } from "./sala.service";
import { UpdateSalaDto } from "./update-sala.dto";
@Controller('sala')
export class SalaController{
    constructor(private readonly salaService : SalaService){}

    @Post()
    async createSala(@Body() createDto : CreateSalaDto):Promise<{message : string}>{
        return await this.salaService.createSala(createDto) 
    }

    @Get()
    async getAllSalasWithResponsavel():Promise<any[]>{
        return await this.salaService.getAllSalasWithResponsavel();
    }

    @Post('edit')
    async edit(@Body() update : UpdateSalaDto):Promise<{message : string}> {
        return await this.salaService.editSalas(update);
    }
}