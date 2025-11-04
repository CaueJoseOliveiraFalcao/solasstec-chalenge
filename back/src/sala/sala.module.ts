import { PrismaService } from "src/prisma.service";
import { SalaController } from "./sala.controller";
import { SalaService } from "./sala.service";

import { Module , forwardRef } from "@nestjs/common";
import { ResponsavelSalaModule } from "src/sala_responsavel/responsavel-sala.module";
import { SalaAuditoriaModule } from "src/sala_auditoria/sala-auditoria.module";

@Module({
    //dependecia circular com responsavel_sala
    imports :[forwardRef(()=>ResponsavelSalaModule) , SalaAuditoriaModule],
    controllers : [SalaController],
    providers : [SalaService , PrismaService],   
    exports : [SalaService],
})

export class SalaModule {}