import {IsString , IsOptional ,IsNotEmpty ,IsInt , IsDateString , IsBoolean} from 'class-validator'

export class CreateVisitanteDto {

    id?: number;
    
    @IsNotEmpty()
    @IsString()
    nome : string

    @IsNotEmpty()
    @IsString()
    documento : string

    @IsNotEmpty()
    @IsString()
    phone  : string

    @IsDateString()
    data_nascimento: string;

    @IsOptional()
    @IsString()
    foto? : string

    @IsOptional()
    @IsBoolean()
    ativo? : boolean

    // tipo prioridade
      @IsOptional()
        @IsBoolean()
        is_tipo_prioridade?: boolean;

        @IsOptional()
        @IsString()
        descricao?: string;

        @IsOptional()
        @IsInt()
        nivel_prioridade?: number;
}