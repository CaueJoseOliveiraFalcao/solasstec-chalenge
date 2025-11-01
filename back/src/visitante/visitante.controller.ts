import { Controller , Post , Body } from "@nestjs/common";
import { VisitanteService } from "./visitante.service";
import { CreateVisitanteDto } from "./create-visitante.dto";
import { Prisma, Visitante } from "generated/prisma";


@Controller('visitante')
    export class VisitanteController {
        constructor(private readonly visitanteService : VisitanteService){}

        @Post()
        async create(@Body() createDto: CreateVisitanteDto) : Promise<Visitante>{
            return this.visitanteService.createVisitante(createDto);
        }
    }