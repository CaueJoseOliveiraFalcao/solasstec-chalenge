import { IsBoolean, IsDateString, IsInt, IsOptional } from 'class-validator';

export class CreateAcessoDto {
  @IsInt()
  visitante_id: number;

  @IsInt()
  sala_id: number;

  @IsInt()
  agendamento_id: number;

  @IsOptional()
  @IsDateString()
  entrada_em?: Date;

  @IsOptional()
  @IsDateString()
  saida_em?: Date;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
