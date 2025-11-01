import { Module } from "@nestjs/common";
import { VisitanteService } from "./visitante.service";
import { VisitanteController } from "./visitante.controller";
import { PrismaService } from "../prisma.service";
import { TipoPrioridadeModule } from "src/tipo_prioridade/tipo_prioridade.module";


@Module({
    controllers : [VisitanteController],
    imports : [TipoPrioridadeModule],
    providers : [VisitanteService , PrismaService],
})
export class VisitanteModule {}