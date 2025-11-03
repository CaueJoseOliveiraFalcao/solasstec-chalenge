import { PrismaService } from "src/prisma.service";
import { SalaController } from "./sala.controller";
import { SalaService } from "./sala.service";
import { Module } from "@nestjs/common";

@Module({
    controllers : [SalaController],
    providers : [SalaService , PrismaService]
})

export class SalaModule {}