import { IsNumber , IsString , IsNotEmpty , IsEmpty, IsJSON, IsOptional, IsBoolean, IsDate } from "class-validator";

export class CreateResponsavelSalaDto{
    @IsNotEmpty()
    @IsString()
    nome : string

    @IsOptional()
    id : number

    @IsNotEmpty()
    @IsString()
    documento : string

    @IsNotEmpty()
    valido_de : Date

    @IsOptional()
    valido_ate : Date | null

    @IsOptional()
    @IsBoolean()
    ativo : boolean
}