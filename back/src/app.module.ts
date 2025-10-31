import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VisitanteModule } from './visitante/visitante.module';
@Module({
  imports: [VisitanteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
