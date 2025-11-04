import { IsInt, IsOptional, IsString, IsObject , IsNotEmpty , IsNumber , Min} from 'class-validator';

export class UpdateSalaDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'Capacidade deve ser pelo menos 1' })
  capacidade: number;
  
  @IsNotEmpty()
  @IsString()
  disponibilidade: string;

  @IsOptional()
  @IsInt()
  responsavel_id: number;

  @IsNotEmpty()
  @IsObject()
  alteracoes?: {
    alteracoes_de_disponibilidade?: {
      alteracoes: Record<string, {
        old_init?: string;
        new_init?: string;
        old_end?: string;
        new_end?: string;
        old_open?: boolean;
        new_open?: boolean;
      }>;
    };
    alteracoes_de_responsavel?: {
      old_id: number;
      new_id: number;
    };
  };
}