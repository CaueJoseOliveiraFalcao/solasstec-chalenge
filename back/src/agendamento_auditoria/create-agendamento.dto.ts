import { IsInt, IsNotEmpty, IsOptional, IsString, Length, IsDateString } from 'class-validator';

export class CreateAgendamentoAuditoriaDto {
  @IsInt()
  visitante_id: number;

  @IsInt()
  sala_id: number;

  @IsDateString()
  data_agendada: Date;

  @IsString()
  @Length(4, 5)
  hora_inicio: string;

  @IsString()
  @Length(4, 5)
  hora_fim: string;

  @IsOptional()
  @IsString()
  code?: string;
}
