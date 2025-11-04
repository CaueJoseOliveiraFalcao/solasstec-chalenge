import { Module } from "@nestjs/common";
import { FeriadoController } from "./feriado.controller";
import { FeriadoService } from "./feriado.service";
import { PrismaService } from "src/prisma.service";


@Module({
    controllers : [FeriadoController],
    providers : [FeriadoService , PrismaService],
    exports : [FeriadoService],
})

export class FeriadoModule {}