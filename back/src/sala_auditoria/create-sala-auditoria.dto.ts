import { IsInt, IsOptional, IsJSON , IsNotEmpty } from 'class-validator';

export class CreateSalaAuditoriaDto {
    
  @IsNotEmpty()
  @IsInt()
  sala_id: number;

  @IsNotEmpty()
  @IsOptional()
  @IsInt()
  responsavel_id?: number;

  @IsNotEmpty()
  alteracao: any;
}
