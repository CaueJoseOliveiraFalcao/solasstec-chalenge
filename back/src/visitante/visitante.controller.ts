import { Controller , Post , Body , Get, Delete, Param} from "@nestjs/common";
import { VisitanteService } from "./visitante.service";
import { CreateVisitanteDto } from "./create-visitante.dto";
import {Visitante } from "generated/prisma";


@Controller('visitante')
    export class VisitanteController {
        constructor(private readonly visitanteService : VisitanteService){}

        @Post()
        async create(@Body() createDto: CreateVisitanteDto) : Promise<Visitante | undefined>{
            return this.visitanteService.createVisitante(createDto);
        }

        @Get()
        async getAllVisitants():Promise<Visitante[]>{
            return this.visitanteService.getAllVisitants()
        }
        @Delete(":id")
        async deleteVisitant(@Param("id") id :number):Promise<{message : string}> {
            await this.visitanteService.deleteVisitant(id);
            return { message: 'Visitante deletado com sucesso' };
        }
        @Post('editar')
        async editVisitant(@Body() createDto : CreateVisitanteDto) : Promise<Visitante | undefined>{
            return this.visitanteService.editVisitante(createDto);
        }
    }