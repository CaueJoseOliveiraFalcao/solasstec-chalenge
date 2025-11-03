'use client'
import CreateFeriadoForm from "@/components/CreateFeriadoForm/CreateFeriadoForm"
import Header from "@/components/header/Header"
import ReciveFeriados from "@/components/ReciveFeriados/ReciveFeriados"
export default function FeriadoPage(){
    return(
        <div>
            <Header/>
            <h1  className="text-center mt-3">Criar Um Feriado</h1>
            <CreateFeriadoForm/>
            <ReciveFeriados/>
        </div>
    )
}