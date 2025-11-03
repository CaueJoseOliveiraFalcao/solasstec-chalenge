import {IsString , IsOptional ,IsNotEmpty ,IsInt , IsDateString , IsBoolean, IsNumber} from 'class-validator'


export class CreateFeriadoDto {
    @IsOptional()
    id_feriado : number
    
    @IsNotEmpty()
    data : Date

    @IsNotEmpty()
    @IsString()
    descricao: string;

    @IsOptional()
    @IsNumber()
    tipo : number

    @IsOptional()
    @IsBoolean()
    ativo : boolean
}