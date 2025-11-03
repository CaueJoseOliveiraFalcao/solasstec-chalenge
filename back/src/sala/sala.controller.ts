import {Controller , Body , Post , Get } from "@nestjs/common";
import { CreateSalaDto } from "./create-sala.dto";
import { Sala , Prisma } from "generated/prisma";
import { SalaService } from "./sala.service";
@Controller('sala')
export class SalaController{
    constructor(private readonly salaService : SalaService){}

    @Post()
    async createSala(@Body() createDto : CreateSalaDto):Promise<{message : string}>{
        return await this.salaService.createSala(createDto) 
    }
}