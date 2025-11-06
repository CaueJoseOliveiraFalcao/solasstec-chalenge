import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAcessoDto {
  @IsInt()
  visitante_id: number;

  @IsInt()
  sala_id: number;

  @IsNotEmpty()
  @IsString()
  code: string;

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
