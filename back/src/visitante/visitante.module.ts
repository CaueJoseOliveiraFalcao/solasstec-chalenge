import { Module } from "@nestjs/common";
import { VisitanteService } from "./visitante.service";
import { VisitanteController } from "./visitante.controller";
import { PrismaService } from "../prisma.service";


@Module({
    controllers : [VisitanteController],
    providers : [VisitanteService , PrismaService],
})
export class VisitanteModule {}