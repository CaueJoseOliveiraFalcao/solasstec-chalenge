import { Controller , Post , Body } from "@nestjs/common";
import { VisitanteService } from "./visitante.service";
import { CreateVisitanteDto } from "./create-visitante.dto";
import { Prisma, Visitante } from "generated/prisma";


@Controller('visitante')
    export class VisitanteController {
        constructor(private readonly visitanteService : VisitanteService){}

        @Post()
        async create(@Body() createDto: CreateVisitanteDto) : Promise<Visitante>{
            const data : Prisma.VisitanteCreateInput = {
                nome : createDto.nome,
                documento : createDto.documento,
                phone : createDto.phone,
                data_nascimento : createDto.data_nascimento,
                ativo : createDto.ativo ?? true,
                foto : createDto.foto,
            }
            const visitante = await this.visitanteService.createVisitante(data);
            return visitante
        }
    }