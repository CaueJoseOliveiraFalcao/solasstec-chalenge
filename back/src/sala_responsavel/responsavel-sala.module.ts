import { PrismaService } from "src/prisma.service";
import { ResposavelSalaService , } from "./responsavel-sala.service";
import { Module } from "@nestjs/common";
import { ResponsavelSalaController } from "./responsavel-sala.controller";

@Module({
    controllers : [ResponsavelSalaController],
    providers : [ResposavelSalaService , PrismaService]
})

export class ResponsavelSalaModule {}