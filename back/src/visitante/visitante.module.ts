import { forwardRef, Module } from "@nestjs/common";
import { VisitanteService } from "./visitante.service";
import { VisitanteController } from "./visitante.controller";
import { PrismaService } from "../prisma.service";
import { TipoPrioridadeModule } from "src/tipo_prioridade/tipo_prioridade.module";
import { AgendamentoModule } from "src/agendamento/agendamento.module";


@Module({
    controllers : [VisitanteController],
    imports : [TipoPrioridadeModule , forwardRef(() => AgendamentoModule)],
    providers : [VisitanteService , PrismaService ],
    exports : [VisitanteService]
})
export class VisitanteModule {}