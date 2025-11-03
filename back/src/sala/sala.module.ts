import { PrismaService } from "src/prisma.service";
import { SalaController } from "./sala.controller";
import { SalaService } from "./sala.service";

import { Module , forwardRef } from "@nestjs/common";
import { ResponsavelSalaModule } from "src/sala_responsavel/responsavel-sala.module";

@Module({
    //dependecia circular com responsavel_sala
    imports :[forwardRef(()=>ResponsavelSalaModule)],
    controllers : [SalaController],
    providers : [SalaService , PrismaService],   
    exports : [SalaService],
})

export class SalaModule {}