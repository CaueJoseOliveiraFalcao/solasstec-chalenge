import { IsNumber , IsString , IsNotEmpty , IsEmpty, IsJSON, IsOptional, IsBoolean , Min } from "class-validator";

export class CreateSalaDto{
    @IsNotEmpty()
    @IsString()
    nome : string
    
    @IsNotEmpty()
    @IsJSON()
    disponibilidade : any

    @IsNotEmpty()
    @IsNumber()
    @Min(1, { message: 'Capacidade deve ser pelo menos 1' })
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