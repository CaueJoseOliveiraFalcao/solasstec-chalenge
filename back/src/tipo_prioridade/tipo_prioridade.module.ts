import { Module } from "@nestjs/common";
import { TipoPrioridadeController } from "./tipo_prioridade.controller";
import { TipoPrioridadeService } from "./tipo_prioridade.service";
import { PrismaService } from "src/prisma.service";


@Module({
    controllers : [TipoPrioridadeController],
    exports : [TipoPrioridadeService],
    providers : [TipoPrioridadeService , PrismaService],
})

export class TipoPrioridadeModule {}