import { forwardRef, Module } from "@nestjs/common";
import { AgendamentoController } from "./agendamento.controller";
import { AgendamentoService } from "./agendamento.service";
import { PrismaService } from "src/prisma.service";
import { FeriadoModule } from "src/feriado/feriado.module";
import { SalaModule } from "src/sala/sala.module";
import { AgendamentoAuditoriaModule } from "src/agendamento_auditoria/agendamento.module";
import { VisitanteModule } from "src/visitante/visitante.module";
import { AcessoModule } from "src/acesso/acesso.module";


@Module({  
  imports: [FeriadoModule , 
    SalaModule ,
    forwardRef(() => VisitanteModule) ,
    AgendamentoAuditoriaModule , 
    AcessoModule
  ],
  
  controllers: [AgendamentoController],
  providers: [AgendamentoService , PrismaService],
  exports : [AgendamentoService]
})
export class AgendamentoModule {}