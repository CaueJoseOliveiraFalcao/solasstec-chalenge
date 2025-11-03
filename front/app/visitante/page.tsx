'use client'
import CreateVisitanteForm from "@/components/CreateVisitantForm/CreateVisitantForm"
import Header from "@/components/header/Header"
import ReciveVisitants from "@/components/ReciveVisitans/ReciveVisitants"

export default function VisitantPage(){
    return(
        <div>
            <Header/>
            <CreateVisitanteForm/>
            <ReciveVisitants/>
        </div>
    )
}