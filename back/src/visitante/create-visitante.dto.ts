import {IsString , IsOptional , IsInt , IsDateString , IsBoolean} from 'class-validator'

export class CreateVisitanteDto {
    @IsString()
    nome : string

    @IsString()
    documento : string

    @IsString()
    phone  : string

    @IsDateString()
    data_nascimento: string;

    @IsOptional()
    @IsInt()
    tipo_prioridade_id? : number

    @IsOptional()
    @IsString()
    foto? : string

    @IsOptional()
    @IsBoolean()
    ativo? : boolean
}