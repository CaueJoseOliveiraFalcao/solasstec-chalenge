import { IsInt, IsNotEmpty, IsString } from "class-validator";


export class CreateAgendamentoDto {
    @IsInt()
    @IsNotEmpty()
    visitante_id: number;

    @IsInt()
    @IsNotEmpty()
    sala_id: number;

    @IsNotEmpty()
    data_agendada: string;

    @IsString()
    @IsNotEmpty()
    hora_inicio: string;

    @IsString()
    @IsNotEmpty()
    hora_fim: string;

    status : number;
}