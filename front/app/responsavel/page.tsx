'use client'
import CreateResponsavelForm from "@/components/CreateResponsavelForm/CreateResponsavelForm"
import Header from "@/components/header/Header"
import ReciveResponsaveis from "@/components/ReciveResponsaveis/ReciveResponsaveis"
export default function FeriadoPage(){
    return(
        <div>
            <Header/>
            <CreateResponsavelForm/>
            <ReciveResponsaveis/>
        </div>
    )
}