import { Body, Controller, Get, Post } from '@nestjs/common';
import { AcessoService } from './acesso.service';
import { CreateAcessoDto } from './create-acesso.dto';

@Controller('acessos')
export class AcessoController {
  constructor(private readonly acessoService: AcessoService) {}

  @Post()
  async create(@Body() data: CreateAcessoDto) {
    return this.acessoService.create(data);
  }

  @Post('validate')
  async validate(@Body() data: string) {
    return this.acessoService.validateAcess(data);
  }

  @Get()
  async findAll() {
    return this.acessoService.findAll();
  }
}
