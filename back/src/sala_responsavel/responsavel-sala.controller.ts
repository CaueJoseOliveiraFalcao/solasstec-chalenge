import {Controller , Body , Post , Get , Delete , Param } from "@nestjs/common";
import { CreateResponsavelSalaDto } from "./create-responsavel-sala.dto";
import { Sala_Responsavel , Prisma } from "generated/prisma";
import { ResposavelSalaService } from "./responsavel-sala.service";

@Controller('responsavel-sala')
export class ResponsavelSalaController{
    constructor(private readonly responsavelSalaService : ResposavelSalaService){}

    @Post()
    async createResponsavelSala(@Body() createDto : CreateResponsavelSalaDto):Promise<{message : string}>{
        return await this.responsavelSalaService.createResponsavelSala(createDto) 
    }
    @Get()
    async getAllResponsaveis():Promise<Sala_Responsavel[]>{
        return this.responsavelSalaService.getAllResponsaveis()
    }
    @Post('edit')
    async edit(@Body() data : CreateResponsavelSalaDto):Promise<{message : string}>{
        return await this.responsavelSalaService.editResponsavel(data);
    }
    @Delete(':responsavelId')
    async deleteResponsavel(@Param('responsavelId') responsavelId : number):Promise<{message : string}>{
            return await this.responsavelSalaService.deleteResponsavel(responsavelId);
        }
}