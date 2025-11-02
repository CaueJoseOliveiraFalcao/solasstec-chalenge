import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VisitanteModule } from './visitante/visitante.module';
import { TipoPrioridadeModule } from './tipo_prioridade/tipo_prioridade.module';
import { FeriadoModule } from './feriado/feriado.module';
@Module({
  imports: [VisitanteModule , TipoPrioridadeModule , FeriadoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
