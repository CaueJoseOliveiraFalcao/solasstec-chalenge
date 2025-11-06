import { PrismaService } from "src/prisma.service";
import { ResposavelSalaService , } from "./responsavel-sala.service";
import { forwardRef, Module } from "@nestjs/common";
import { ResponsavelSalaController } from "./responsavel-sala.controller";
import { SalaModule } from "src/sala/sala.module";

@Module({
    imports :[forwardRef(()=>SalaModule)],
    controllers : [ResponsavelSalaController],
    providers : [ResposavelSalaService , PrismaService],
    exports : [ResposavelSalaService]
})

export class ResponsavelSalaModule {}