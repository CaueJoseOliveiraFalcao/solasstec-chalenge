import { IsNumber , IsString , IsNotEmpty , IsEmpty, IsJSON, IsOptional, IsBoolean } from "class-validator";

export class CreateSalaDto{
    @IsNotEmpty()
    @IsString()
    nome : string
    
    @IsNotEmpty()
    @IsJSON()
    disponibilidade : any

    @IsNotEmpty()
    @IsNumber()
    capacidade : number

    @IsOptional()
    @IsNumber()
    variacao_capacidade : number

    @IsOptional()
    @IsNumber()
    responsavel_id : number
    
    @IsOptional()
    @IsBoolean()
    ativo : boolean


}