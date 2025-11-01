import {IsString , IsOptional ,IsNotEmpty ,IsInt , IsDateString , IsBoolean} from 'class-validator'


export class CreateTipoPrioridadeDTO {
    @IsNotEmpty()
    @IsString()
    descricao : string

    @IsNotEmpty()
    @IsInt()
    nivel_prioridade : number

    @IsOptional()
    @IsBoolean()
    ativo : boolean

}