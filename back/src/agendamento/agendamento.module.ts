import { Module } from "@nestjs/common";
import { AgendamentoController } from "./agendamento.controller";
import { AgendamentoService } from "./agendamento.service";
import { PrismaService } from "src/prisma.service";
import { FeriadoModule } from "src/feriado/feriado.module";
import { SalaModule } from "src/sala/sala.module";


@Module({  
  controllers: [AgendamentoController],
  providers: [AgendamentoService , PrismaService],
  imports: [FeriadoModule , SalaModule]
})
export class AgendamentoModule {}