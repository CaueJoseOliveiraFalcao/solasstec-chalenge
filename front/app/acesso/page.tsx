'use client'
import BaseForm from "@/components/BaseForm";
import Header from "@/components/header/Header";import { useState } from "react";
;
export default function AgendamentoPage(){
    const [acessId , setAcessId] = useState<string>('');

    const handleSubmit = (e : any) => {
        e.preventDefault();
        console.log(acessId);
    }
    return (
        <div>
            <Header/>
            <div className="flex mt-5 justify-center">
            <BaseForm>
                <h1>Registre a Entrada do Visitante</h1>

                <form onSubmit={(e) => handleSubmit(e)}>
                    <input onChange={(e)=>setAcessId(e.target.value)} type="text" value={acessId} />
                    <input type="submit" />
                </form>
            </BaseForm>
            </div>

        </div>
    )
}