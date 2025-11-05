import { IsNotEmpty } from "class-validator";


export class VerifyAgendamentoDataDto {
    @IsNotEmpty()
    sala_id: number;

    @IsNotEmpty()
    data_agendada: string;
}