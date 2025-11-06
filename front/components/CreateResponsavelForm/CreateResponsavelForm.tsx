import { useState } from "react"
import api from "@/app/api"
import '../GenericInputs.css'
import BaseForm from "../BaseForm"
import ErrorComponent from "../Error/ErrorComponent"
import SucessComponent from "../Sucess/SucessComponent"

export default function CreateResponsavelForm() {
    const [nome, setNome] = useState("")
    const [documento, setDocumento] = useState("")
    const [validoDe, setValidoDe] = useState(new Date().toISOString().split("T")[0])
    const [validoAte, setValidoAte] = useState("")

    const [errorPopup, setErroPopup] = useState({ error: false, titulo: "", desc: "" })
    const [successPopup, setSuccessPopup] = useState({ success: false, titulo: "", desc: "" })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            await api.post("/responsavel-sala", {
                nome,
                documento,
                valido_de: new Date(),
                valido_ate: validoAte ? new Date(validoAte) : null,
                ativo: true
            })

            setSuccessPopup({
                success: true,
                titulo: "Sucesso!",
                desc: "Responsavel criado com sucesso."
            })
            setTimeout(() => window.location.reload(), 2000)
        } catch (error: any) {
            if (error.response && error.response.data) {
                const { message, error: errType } = error.response.data;
                setErroPopup({
                    error: true,
                    titulo: 'Erro',
                    desc: message || 'Ocorreu um erro ao enviar.',
                });
            } else {
                setErroPopup({
                    error: true,
                    titulo: 'Erro',
                    desc: 'Não foi possível conectar ao servidor.',
                });
            }
        }
    }

    return (
        <div className="flex justify-center items-center flex-col mt-7">
            <BaseForm>
                    {errorPopup.error && (
                    <ErrorComponent
                        titulo={errorPopup.titulo}
                        desc={errorPopup.desc}
                        onClose={() => setErroPopup({ error: false, titulo: '', desc: '' })}
                    />
                    )}

                    {successPopup.success && (
                    <SucessComponent
                        titulo={successPopup.titulo}
                        desc={successPopup.desc}
                        onClose={() => setSuccessPopup({ success: false, titulo: '', desc: '' })}
                    />
                    )}
                <h1 className="mt-4 mb-2 text-2xl font-bold">Criar responsável de sala</h1>

                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="flex justify-around w-full flex-col">
                            <label htmlFor="nome">Nome do Responsável</label>
                            <input
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />

                            <label htmlFor="documento">CPF</label>
                            <input
                                type="text"
                                value={documento}
                                maxLength={11}
                                minLength={11}
                                onChange={(e) => setDocumento(e.target.value)}
                                required
                            />
                    </div>


                    <input
                        type="submit"
                        value="Enviar"
                        className="enviar mt-6"
                    />
                </form>
            </BaseForm>
        </div>
    )
}
