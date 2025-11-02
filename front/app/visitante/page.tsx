'use client'
import CreateVisitanteForm from "@/components/CreateVisitantForm/CreateVisitantForm"
import Header from "@/components/header/Header"
import ReciveVisitants from "@/components/ReciveVisitans/ReciveVisitants"

export default function VisitantPage(){
    return(
        <div>
            <Header/>
            <h1  className="text-center mt-3">Gerenciamento de Visitantes</h1>
            <CreateVisitanteForm/>
            <ReciveVisitants/>
        </div>
    )
}