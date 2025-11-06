import { Body, Controller, Get, Post } from '@nestjs/common';
import { AcessoService } from './acesso.service';
import { CreateAcessoDto } from './create-acesso.dto';

@Controller('acessos')
export class AcessoController {
  constructor(private readonly acessoService: AcessoService) {}

  @Post()
  async validate(@Body() data : {acessCode : string}) {
    return this.acessoService.registrarEntrada(data);
  }

}
