import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VisitanteModule } from './visitante/visitante.module';
import { TipoPrioridadeModule } from './tipo_prioridade/tipo_prioridade.module';
import { FeriadoModule } from './feriado/feriado.module';
import { SalaModule } from './sala/sala.module';
import { ResponsavelSalaModule } from './sala_responsavel/responsavel-sala.module';
import { SalaAuditoriaModule } from './sala_auditoria/sala-auditoria.module';
@Module({
  imports: [
    VisitanteModule , 
    TipoPrioridadeModule , 
    FeriadoModule , 
    SalaModule , 
    ResponsavelSalaModule , 
    SalaAuditoriaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
